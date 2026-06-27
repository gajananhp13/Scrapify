import { NextRequest, NextResponse } from 'next/server';
import { getStats, incrementVisitor, incrementScrapedLinks } from '@/lib/stats-storage';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error reading stats:', error);
    return NextResponse.json(
      { visitorCount: 0, totalScrapedLinks: 0, lastUpdated: new Date().toISOString() },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, linksCount } = body;

    let stats;

    if (action === 'incrementVisitor') {
      stats = await incrementVisitor();
    } else if (action === 'updateScrapedLinks' && typeof linksCount === 'number' && linksCount > 0) {
      stats = await incrementScrapedLinks(linksCount);
    } else {
      stats = await getStats();
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { visitorCount: 0, totalScrapedLinks: 0, lastUpdated: new Date().toISOString() },
      { status: 200 }
    );
  }
}
