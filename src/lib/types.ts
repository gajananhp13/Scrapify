export interface ScrapedLink {
  text?: string;
  href?: string;
}

export interface ScrapedImage {
  src?: string;
  alt?: string;
}

export interface ScrapedDataTable {
  id: string; // Unique ID for the table, e.g., "table-1"
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ScrapedData {
  url: string;
  scrapedAt: string; // ISO string
  title?: string;
  meta: {
    description?: string;
    keywords?: string; // Comma-separated string or array of strings
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  paragraphs: string[];
  links: ScrapedLink[];
  images: ScrapedImage[];
  tables: ScrapedDataTable[];
  jsonLd: any[]; // Array of parsed JSON-LD objects
  aiSummary?: string;
  aiContentType?: string;
}

export interface ScrapeHistoryItem extends ScrapedData {
  id: string; // Unique ID for the history item, typically timestamp based
}
