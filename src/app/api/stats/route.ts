import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client with proper error handling
let redis: Redis | null = null;

function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      throw new Error('Upstash Redis credentials are missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.');
    }
    
    redis = new Redis({
      url,
      token,
    });
  }
  return redis;
}

interface Stats {
  visitorCount: number;
  totalScrapedLinks: number;
  lastUpdated: string;
}

// GET: Retrieve current stats
export async function GET() {
  try {
    const redisClient = getRedisClient();
    const visitorCount = (await redisClient.get<number>('visitorCount')) || 0;
    const totalScrapedLinks = (await redisClient.get<number>('totalScrapedLinks')) || 0;
    const lastUpdated = (await redisClient.get<string>('lastUpdated')) || new Date().toISOString();

    return NextResponse.json({
      visitorCount,
      totalScrapedLinks,
      lastUpdated,
    });
  } catch (error) {
    console.error('Error reading stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve stats';
    
    // Return default values if Redis is not configured or connection fails
    if (errorMessage.includes('credentials are missing') || errorMessage.includes('Redis')) {
      console.warn('Redis connection issue, returning default values');
      return NextResponse.json({
        visitorCount: 0,
        totalScrapedLinks: 0,
        lastUpdated: new Date().toISOString(),
        warning: 'Redis not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables in Vercel.',
      });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Update stats
export async function POST(request: NextRequest) {
  try {
    const redisClient = getRedisClient();
    const body = await request.json();
    const { action, linksCount } = body;

    const now = new Date().toISOString();

    if (action === 'incrementVisitor') {
      await redisClient.incr('visitorCount');
      await redisClient.set('lastUpdated', now);
    } 
    
    if (action === 'updateScrapedLinks' && typeof linksCount === 'number' && linksCount > 0) {
      await redisClient.incrby('totalScrapedLinks', linksCount);
      await redisClient.set('lastUpdated', now);
    }

    // Return updated stats
    const visitorCount = (await redisClient.get<number>('visitorCount')) || 0;
    const totalScrapedLinks = (await redisClient.get<number>('totalScrapedLinks')) || 0;
    const lastUpdated = (await redisClient.get<string>('lastUpdated')) || now;

    return NextResponse.json({
      visitorCount,
      totalScrapedLinks,
      lastUpdated,
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update stats';
    
    // Return current values if Redis fails
    if (errorMessage.includes('credentials are missing') || errorMessage.includes('Redis')) {
      console.warn('Redis connection issue, returning default values');
      return NextResponse.json({
        visitorCount: 0,
        totalScrapedLinks: 0,
        lastUpdated: new Date().toISOString(),
        warning: 'Redis not available',
      });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

