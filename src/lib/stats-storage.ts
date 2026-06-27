import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

const STATS_DIR = path.join(process.env.VERCEL ? '/tmp' : process.cwd(), '.stats');
const STATS_FILE = path.join(STATS_DIR, 'data.json');

interface StatsData {
  visitorCount: number;
  totalScrapedLinks: number;
  lastUpdated: string;
}

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      redis = new Redis({ url, token });
      return redis;
    } catch (e) {
      console.warn('Failed to init Redis:', e);
    }
  }
  return null;
}

function ensureStatsDir() {
  if (!fs.existsSync(STATS_DIR)) {
    fs.mkdirSync(STATS_DIR, { recursive: true });
  }
}

function readFileStats(): StatsData {
  try {
    ensureStatsDir();
    if (fs.existsSync(STATS_FILE)) {
      return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.warn('Failed to read stats file:', e);
  }
  return { visitorCount: 0, totalScrapedLinks: 0, lastUpdated: new Date().toISOString() };
}

function writeFileStats(data: StatsData) {
  try {
    ensureStatsDir();
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Failed to write stats file:', e);
  }
}

export async function getStats(): Promise<StatsData> {
  const r = getRedis();
  if (r) {
    try {
      const visitorCount = (await r.get<number>('visitorCount')) || 0;
      const totalScrapedLinks = (await r.get<number>('totalScrapedLinks')) || 0;
      const lastUpdated = (await r.get<string>('lastUpdated')) || new Date().toISOString();
      return { visitorCount, totalScrapedLinks, lastUpdated };
    } catch (e) {
      console.warn('Redis getStats failed, falling back to file:', e);
    }
  }
  return readFileStats();
}

export async function incrementVisitor(): Promise<StatsData> {
  const r = getRedis();
  if (r) {
    try {
      await r.incr('visitorCount');
      const now = new Date().toISOString();
      await r.set('lastUpdated', now);
      const visitorCount = (await r.get<number>('visitorCount')) || 0;
      const totalScrapedLinks = (await r.get<number>('totalScrapedLinks')) || 0;
      return { visitorCount, totalScrapedLinks, lastUpdated: now };
    } catch (e) {
      console.warn('Redis incrementVisitor failed, falling back to file:', e);
    }
  }

  const data = readFileStats();
  data.visitorCount += 1;
  data.lastUpdated = new Date().toISOString();
  writeFileStats(data);
  return data;
}

export async function incrementScrapedLinks(linksCount: number): Promise<StatsData> {
  const r = getRedis();
  if (r) {
    try {
      await r.incrby('totalScrapedLinks', linksCount);
      const now = new Date().toISOString();
      await r.set('lastUpdated', now);
      const visitorCount = (await r.get<number>('visitorCount')) || 0;
      const totalScrapedLinks = (await r.get<number>('totalScrapedLinks')) || 0;
      return { visitorCount, totalScrapedLinks, lastUpdated: now };
    } catch (e) {
      console.warn('Redis incrementScrapedLinks failed, falling back to file:', e);
    }
  }

  const data = readFileStats();
  data.totalScrapedLinks += linksCount;
  data.lastUpdated = new Date().toISOString();
  writeFileStats(data);
  return data;
}
