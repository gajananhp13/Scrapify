import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ScrapedData, ScrapedDataTable, ScrapedImage } from "./types";
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadJson(data: any, filename: string = "scraped_data.json") {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Basic CSV converter (can be expanded for more complex structures)
function convertToCSV(objArray: any[] | object): string {
  if (!objArray) return '';
  const array = Array.isArray(objArray) ? objArray : [objArray];
  if (array.length === 0) return '';

  let csvStr = "";
  
  // Extract headers
  const headers = Object.keys(array[0]);
  csvStr += headers.join(",") + "\r\n";

  for (const item of array) {
    const row = headers.map(header => {
      let cell = item[header] === null || item[header] === undefined ? "" : item[header];
      if (typeof cell === 'object') {
        cell = JSON.stringify(cell); // Stringify nested objects/arrays
      }
      // Escape double quotes and commas
      cell = String(cell).replace(/"/g, '""');
      if (String(cell).includes(",")) {
        cell = `"${cell}"`;
      }
      return cell;
    });
    csvStr += row.join(",") + "\r\n";
  }
  return csvStr;
}

// Flattens ScrapedData for a simpler CSV export
function flattenScrapedDataForCsv(data: ScrapedData): Record<string, any> {
  return {
    url: data.url,
    scrapedAt: data.scrapedAt,
    title: data.title,
    metaDescription: data.meta.description,
    metaKeywords: data.meta.keywords,
    aiSummary: data.aiSummary,
    aiContentType: data.aiContentType,
    h1Headings: data.headings.h1.join(' | '),
    h2Headings: data.headings.h2.join(' | '),
    // For brevity, not including all h3-h6, paragraphs, links, images, tables, jsonLd directly
    // as they can be very large and complex for a single CSV row.
    // Consider separate exports or more advanced flattening for those.
    paragraphCount: data.paragraphs.length,
    linkCount: data.links.length,
    imageCount: data.images.length,
    tableCount: data.tables.length,
    jsonLdItemCount: data.jsonLd.length,
  };
}


export function downloadCsv(data: ScrapedData, filename: string = "scraped_data.csv") {
  const flattenedData = flattenScrapedDataForCsv(data);
  const csvStr = convertToCSV([flattenedData]); // convertToCSV expects an array
  const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// For history CSV export
export function downloadHistoryCsv(data: ScrapedData[], filename: string = "scrape_history.csv") {
  const flattenedHistory = data.map(flattenScrapedDataForCsv);
  const csvStr = convertToCSV(flattenedHistory);
  const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Simple unique ID generator
export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function downloadTableAsXlsx(table: ScrapedDataTable, filename: string) {
  if (table.headers.length === 0 && table.rows.length === 0) {
    alert("This table has no data to download.");
    return;
  }
  
  // The data needs to be an array of arrays for sheet_add_aoa
  const dataForSheet = [
      table.headers,
      ...table.rows
  ];

  const ws = XLSX.utils.aoa_to_sheet(dataForSheet);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Generate XLSX file and trigger download
  XLSX.writeFile(wb, filename);
}


// Download all scraped images as a zip file
export async function downloadImagesAsZip(images: ScrapedImage[], zipFilename: string) {
    if (!images || images.length === 0) {
      alert("No images to download.");
      return;
    }
  
    const zip = new JSZip();
  
    console.log("Preparing images for download...");
  
    const imageFetchPromises = images.map(async (image, index) => {
      if (!image.src) {
        return;
      }
      try {
        // Use the server-side proxy to bypass CORS issues.
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(image.src)}`);
        if (!response.ok) {
          console.warn(`Skipping image ${image.src}: Failed to fetch via proxy (status ${response.status})`);
          return;
        }
        const blob = await response.blob();
        
        let filename = `image_${index + 1}`;
        try {
            const url = new URL(image.src);
            const pathSegments = url.pathname.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment) {
                filename = `${index}_${lastSegment.replace(/[^a-z0-9_.\-]/gi, '_')}`;
            }
        } catch(e) { /* use default filename */ }
        
        // Ensure file has an extension
        if (!/\.[^/.]+$/.test(filename)) {
            const extension = blob.type.split('/')[1] || 'jpg';
            filename = `${filename}.${extension}`;
        }
  
        zip.file(filename, blob);
      } catch (error) {
        console.error(`Could not fetch or add image ${image.src} to zip:`, error);
      }
    });
  
    await Promise.all(imageFetchPromises);
  
    if (Object.keys(zip.files).length === 0) {
        alert("Could not fetch any of the images. This might be due to server errors or the images being inaccessible.");
        return;
    }

    zip.generateAsync({ type: "blob" }).then(function(content) {
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = zipFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }).catch(err => {
        console.error("Failed to generate zip file", err);
        alert("An error occurred while creating the zip file.");
    });
  }
