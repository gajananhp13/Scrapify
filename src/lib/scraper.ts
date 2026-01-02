import * as cheerio from 'cheerio';
import type { ScrapedData, ScrapedDataTable, ScrapedLink, ScrapedImage } from './types';

// Helper to fetch HTML content
async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'ScrapifyBot/1.0' } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching URL ${url}:`, error);
    throw new Error(`Failed to fetch HTML from ${url}. Error: ${(error as Error).message}`);
  }
}

// Helper to make URLs absolute
function makeAbsoluteUrl(base: string, relative?: string): string | undefined {
  if (!relative) return undefined;
  try {
    return new URL(relative, base).href;
  } catch (e) {
    // Invalid URL, maybe a mailto: or tel: link, or just malformed
    return relative; // Return as is
  }
}

export async function scrapeWebPage(pageUrl: string): Promise<Omit<ScrapedData, 'aiSummary' | 'aiContentType' | 'scrapedAt'>> {
  const html = await fetchHtml(pageUrl);
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim() || $('meta[property="og:title"]').attr('content')?.trim() || $('h1').first().text().trim();
  
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || $('meta[property="og:description"]').attr('content')?.trim();
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.trim();

  const headings = { h1: [] as string[], h2: [] as string[], h3: [] as string[], h4: [] as string[], h5: [] as string[], h6: [] as string[] };
  $('h1').each((_, el) => headings.h1.push($(el).text().trim()));
  $('h2').each((_, el) => headings.h2.push($(el).text().trim()));
  $('h3').each((_, el) => headings.h3.push($(el).text().trim()));
  $('h4').each((_, el) => headings.h4.push($(el).text().trim()));
  $('h5').each((_, el) => headings.h5.push($(el).text().trim()));
  $('h6').each((_, el) => headings.h6.push($(el).text().trim()));

  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const paragraphText = $(el).text().trim();
    if (paragraphText) paragraphs.push(paragraphText);
  });

  const links: ScrapedLink[] = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href) {
      links.push({ text, href: makeAbsoluteUrl(pageUrl, href) });
    }
  });

  const images: ScrapedImage[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    const alt = $(el).attr('alt');
    if (src) {
      images.push({ src: makeAbsoluteUrl(pageUrl, src), alt: alt?.trim() });
    }
  });
  
  // Add images from <picture><source srcset/></picture>
  $('picture source').each((_, el) => {
    const srcset = $(el).attr('srcset');
    // Basic srcset parsing: take the first URL
    const firstSrc = srcset?.split(',')[0].trim().split(' ')[0];
    if (firstSrc) {
        const imgElement = $(el).siblings('img').first();
        const alt = imgElement.attr('alt');
        images.push({ src: makeAbsoluteUrl(pageUrl, firstSrc), alt: alt?.trim() });
    }
  });
  // Deduplicate images based on src
  const uniqueImages = Array.from(new Map(images.map(img => [img.src, img])).values());


  const tables: ScrapedDataTable[] = [];
  $('table').each((tableIndex, tableEl) => {
    const $table = $(tableEl);
    const tableId = $table.attr('id') || `table-${tableIndex + 1}`;
    const caption = $table.find('caption').first().text().trim() || undefined;
    const headers: string[] = [];
    const rows: string[][] = [];

    $table.find('thead tr th, thead tr td').each((_, th) => { // Also check for td in thead
      headers.push($(th).text().trim());
    });
    
    // If no headers in thead, try to get from first tr in tbody
    if (headers.length === 0) {
        $table.find('tbody tr:first-child th, tbody tr:first-child td').each((_, thTd) => {
            headers.push($(thTd).text().trim());
        });
    }


    $table.find('tbody tr').each((_, rowEl) => {
      const rowCells: string[] = [];
      $(rowEl).find('td').each((_, cellEl) => {
        rowCells.push($(cellEl).text().trim());
      });
      if (rowCells.length > 0) { // Only add rows with content
        rows.push(rowCells);
      }
    });
    
    // Only add table if it has some content (headers or rows)
    if (headers.length > 0 || rows.some(row => row.length > 0)) {
        tables.push({ id: tableId, caption, headers, rows });
    }
  });

  const jsonLd: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const scriptContent = $(el).html();
      if (scriptContent) {
        jsonLd.push(JSON.parse(scriptContent));
      }
    } catch (e) {
      console.warn('Failed to parse JSON-LD:', e);
    }
  });

  return {
    url: pageUrl,
    title,
    meta: {
      description: metaDescription,
      keywords: metaKeywords,
    },
    headings,
    paragraphs,
    links,
    images: uniqueImages,
    tables,
    jsonLd,
  };
}
