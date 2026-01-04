import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebPage } from '@/lib/scraper';
import type { ScrapedData } from '@/lib/types';
import { summarizeWebPage } from '@/ai/flows/summarize-web-page';
import { classifyContentType } from '@/ai/flows/classify-content-type';
import { Redis } from '@upstash/redis';

// Initialize Redis client with proper error handling
let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      console.warn('Upstash Redis credentials are missing. Stats tracking will be disabled.');
      return null;
    }
    
    try {
      redis = new Redis({
        url,
        token,
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      return null;
    }
  }
  return redis;
}

// Basic URL validation
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const urlToScrape = searchParams.get('url');

  if (!urlToScrape) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  if (!isValidUrl(urlToScrape)) {
    return NextResponse.json({ error: 'Invalid URL format provided' }, { status: 400 });
  }

  try {
    const scrapedContent = await scrapeWebPage(urlToScrape);

    // Prepare data for AI flows
    const aiInput = {
      title: scrapedContent.title || '',
      metaDescription: scrapedContent.meta.description || '',
      // Combine all headings into a single string for AI
      headings: Object.values(scrapedContent.headings).flat().join(' \n '),
      // Combine all paragraphs for AI
      paragraphs: scrapedContent.paragraphs.join(' \n '),
      // Stringify JSON-LD for AI
      jsonLd: JSON.stringify(scrapedContent.jsonLd),
    };
    
    // Asynchronously call AI functions
    // Using different variable names for AI flow inputs as they might differ slightly in schema.
    // For summarizeWebPage flow
     const summarizeInput = {
      title: scrapedContent.title || '',
      metaDescription: scrapedContent.meta.description || '',
      headings: Object.values(scrapedContent.headings).flat().join('; '),
      paragraphs: scrapedContent.paragraphs.slice(0, 10).join('; '), // Limiting paragraphs for brevity
      jsonld: JSON.stringify(scrapedContent.jsonLd.slice(0,2)), // Limiting JSON-LD for brevity
    };

    // For classifyContentType flow
    const classifyInput = {
        title: scrapedContent.title || '',
        metaDescription: scrapedContent.meta.description || '',
        headings: Object.values(scrapedContent.headings).flat().slice(0,10), // Limiting headings
        paragraphs: scrapedContent.paragraphs.slice(0,10), // Limiting paragraphs
        jsonLd: JSON.stringify(scrapedContent.jsonLd.slice(0,2)),
    };


    let summaryResult, classificationResult;
    try {
      summaryResult = await summarizeWebPage(summarizeInput);
    } catch (aiError) {
      console.error("Error in summarizeWebPage AI flow:", aiError);
      // Continue without summary if AI fails
    }
    try {
      classificationResult = await classifyContentType(classifyInput);
    } catch (aiError) {
      console.error("Error in classifyContentType AI flow:", aiError);
      // Continue without classification if AI fails
    }


    const result: ScrapedData = {
      ...scrapedContent,
      scrapedAt: new Date().toISOString(),
      aiSummary: summaryResult?.summary,
      aiContentType: classificationResult?.contentType,
    };

    // Update total scraped links count in Upstash Redis
    const linksCount = scrapedContent.links.length;
    if (linksCount > 0) {
      try {
        const redisClient = getRedisClient();
        if (redisClient) {
          await redisClient.incrby('totalScrapedLinks', linksCount);
          await redisClient.set('lastUpdated', new Date().toISOString());
        }
      } catch (redisError) {
        console.error('Error updating scraped links count in Upstash:', redisError);
        // Continue even if stats update fails
      }
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Scraping process failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during scraping.';
    // Differentiate between fetch errors and other errors for status codes
    if (errorMessage.startsWith('Failed to fetch HTML')) {
        return NextResponse.json({ error: `Could not reach or process URL: ${urlToScrape}. ${errorMessage}` }, { status: 400 });
    }
    return NextResponse.json({ error: `Scraping failed: ${errorMessage}` }, { status: 500 });
  }
}
