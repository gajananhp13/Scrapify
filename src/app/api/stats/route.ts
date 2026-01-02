import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://precious-opossum-8152.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AR_YAAImcDJlZGFmODVlZmI1ZjY0Y2RlYTZlMTgwZDM1MWI1ZjUxYXAyODE1Mg',
});

interface Stats {
  visitorCount: number;
  totalScrapedLinks: number;
  lastUpdated: string;
}

// GET: Retrieve current stats
export async function GET() {
  try {
    const visitorCount = (await redis.get<number>('visitorCount')) || 0;
    const totalScrapedLinks = (await redis.get<number>('totalScrapedLinks')) || 0;
    const lastUpdated = (await redis.get<string>('lastUpdated')) || new Date().toISOString();

    return NextResponse.json({
      visitorCount,
      totalScrapedLinks,
      lastUpdated,
    });
  } catch (error) {
    console.error('Error reading stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
}

// POST: Update stats
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, linksCount } = body;

    if (action === 'incrementVisitor') {
      await redis.incr('visitorCount');
      await redis.set('lastUpdated', new Date().toISOString());
    } 
    
    if (action === 'updateScrapedLinks' && typeof linksCount === 'number') {
      await redis.incrby('totalScrapedLinks', linksCount);
      await redis.set('lastUpdated', new Date().toISOString());
    }

    // Return updated stats
    const visitorCount = (await redis.get<number>('visitorCount')) || 0;
    const totalScrapedLinks = (await redis.get<number>('totalScrapedLinks')) || 0;

    return NextResponse.json({
      visitorCount,
      totalScrapedLinks,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    );
  }
}

