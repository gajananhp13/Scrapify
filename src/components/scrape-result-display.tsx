"use client"

import { useState } from "react";
import type { ScrapedData, ScrapedLink, ScrapedImage, ScrapedDataTable } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Image as ImageIcon, TableIcon, FileJson, FileText, Heading1, Heading2, Heading3, Type, LinkIcon, Info, Tags, CalendarDays, Loader2, FileSpreadsheet } from "lucide-react";
import { JsonViewer } from "./json-viewer";
import { downloadJson, downloadCsv, downloadImagesAsZip, downloadTableAsXlsx } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image"; // Using next/image for placeholders

const DataSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean; badgeCount?: number }> = ({ title, icon: Icon, children, defaultOpen = false, badgeCount }) => (
  <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-2 text-primary" />
        {title}
        {badgeCount !== undefined && badgeCount > 0 && <Badge variant="secondary" className="ml-2">{badgeCount}</Badge>}
      </div>
    </AccordionTrigger>
    <AccordionContent className="prose dark:prose-invert max-w-none">
      {children}
    </AccordionContent>
  </AccordionItem>
);

export function ScrapeResultDisplay({ data }: { data: ScrapedData }) {
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);

  if (!data) return null;

  const sanitizeFilename = (name: string) => name.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
  const filenameBase = sanitizeFilename(data.title || new URL(data.url).hostname);

  const handleDownloadImages = async () => {
    if (!data.images || data.images.length === 0) return;
    setIsDownloadingImages(true);
    try {
      await downloadImagesAsZip(data.images, `${filenameBase}_images.zip`);
    } catch (e) {
      console.error("Image download failed", e);
      // A toast notification could be used here for better user feedback
    } finally {
      setIsDownloadingImages(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl mt-8">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl break-all line-clamp-2">{data.title || "Untitled Page"}</CardTitle>
        <CardDescription className="text-sm flex items-center gap-2">
          <ExternalLink className="h-4 w-4" /> 
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary break-all">
            {data.url}
          </a>
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2">
          {data.aiContentType && (
            <Badge variant="default" className="text-sm">
              <Info className="h-4 w-4 mr-1" /> Type: {data.aiContentType}
            </Badge>
          )}
           <Badge variant="outline" className="text-sm">
             <CalendarDays className="h-4 w-4 mr-1" /> Scraped: {new Date(data.scrapedAt).toLocaleString()}
           </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.aiSummary && (
          <div className="mb-6 p-4 bg-accent/20 rounded-lg border border-accent">
            <h3 className="text-lg font-semibold mb-2 flex items-center"><Type className="h-5 w-5 mr-2 text-accent" />AI Summary</h3>
            <p className="text-foreground/90">{data.aiSummary}</p>
          </div>
        )}

        <Accordion type="multiple" className="w-full" defaultValue={['meta-information', 'headings']}>
          <DataSection title="Meta Information" icon={Tags}>
            {data.meta.description && <p><strong>Description:</strong> {data.meta.description}</p>}
            {data.meta.keywords && <p><strong>Keywords:</strong> {data.meta.keywords}</p>}
            {!data.meta.description && !data.meta.keywords && <p className="text-muted-foreground">No meta description or keywords found.</p>}
          </DataSection>

          <DataSection title="Headings" icon={Heading1} badgeCount={Object.values(data.headings).reduce((sum, arr) => sum + arr.length, 0) }>
            {Object.entries(data.headings).map(([level, texts]) =>
              texts.length > 0 && (
                <div key={level} className="mb-2">
                  <h4 className="font-semibold capitalize flex items-center">
                    {level === 'h1' && <Heading1 className="h-4 w-4 mr-1" />}
                    {level === 'h2' && <Heading2 className="h-4 w-4 mr-1" />}
                    {level === 'h3' && <Heading3 className="h-4 w-4 mr-1" />}
                    {level.toUpperCase()}:
                  </h4>
                  <ul className="list-disc list-inside pl-4">
                    {texts.map((text, i) => <li key={i}>{text}</li>)}
                  </ul>
                </div>
              )
            )}
          </DataSection>

          <DataSection title="Paragraphs" icon={Type} badgeCount={data.paragraphs.length}>
            <ScrollArea className="h-[200px] p-2 border rounded">
              {data.paragraphs.length > 0 ? data.paragraphs.map((p, i) => <p key={i} className="mb-2">{p}</p>) : <p className="text-muted-foreground">No paragraphs found.</p>}
            </ScrollArea>
          </DataSection>

          <DataSection title="Links" icon={LinkIcon} badgeCount={data.links.length}>
             <ScrollArea className="h-[200px] p-2 border rounded">
              {data.links.length > 0 ? (
                <ul className="space-y-1">
                  {data.links.map((link: ScrapedLink, i: number) => (
                    <li key={i} className="text-sm truncate">
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all" title={link.href}>
                        {link.text || link.href}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-muted-foreground">No links found.</p>}
            </ScrollArea>
          </DataSection>
          
          <DataSection title="Images" icon={ImageIcon} badgeCount={data.images.length}>
            <ScrollArea className="h-[300px] p-2 border rounded">
            {data.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {data.images.map((img: ScrapedImage, i: number) => (
                  <div key={i} className="border rounded p-1 aspect-square flex flex-col items-center justify-center">
                     { /* Using standard img tag for external scraped content to avoid next/image domain configuration issues */ }
                    <img 
                        src={img.src || "https://placehold.co/100x100.png"} 
                        alt={img.alt || 'Scraped image'} 
                        className="max-h-24 max-w-full object-contain mb-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100.png"; }}
                    />
                    <p className="text-xs text-muted-foreground truncate w-full text-center" title={img.alt || img.src}>{img.alt || 'No alt text'}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground">No images found.</p>}
            </ScrollArea>
          </DataSection>

          <DataSection title="Tables" icon={TableIcon} badgeCount={data.tables.length}>
            <ScrollArea className="max-h-[400px] p-1">
              {data.tables.length > 0 ? data.tables.map((table: ScrapedDataTable, i: number) => (
                <div key={table.id || i} className="mb-4 border rounded">
                  <div className="flex justify-between items-center p-2 bg-muted/50 border-b">
                    <p className="font-semibold italic text-sm truncate pr-2">{table.caption || `Table ${i + 1}`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadTableAsXlsx(table, `${filenameBase}_${sanitizeFilename(table.caption || `table_${i+1}`)}.xlsx`)}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                  <div className="p-2 overflow-x-auto">
                    <table className="min-w-full divide-y divide-border text-sm">
                      {table.headers.length > 0 && (
                        <thead className="bg-muted/50">
                          <tr>{table.headers.map((th, j) => <th key={j} className="px-2 py-1 text-left font-medium">{th}</th>)}</tr>
                        </thead>
                      )}
                      <tbody className="divide-y divide-border">
                        {table.rows.map((row, k) => <tr key={k}>{row.map((td, l) => <td key={l} className="px-2 py-1">{td}</td>)}</tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )) : <p className="text-muted-foreground p-2">No tables found.</p>}
            </ScrollArea>
          </DataSection>
          
          <DataSection title="JSON-LD" icon={FileJson} badgeCount={data.jsonLd.length}>
            {data.jsonLd.length > 0 ? (
                data.jsonLd.map((item, index) => (
                    <JsonViewer key={index} data={item} title={`JSON-LD Item ${index + 1}`} initialExpanded={false}/>
                ))
            ) : <p className="text-muted-foreground">No JSON-LD data found.</p>}
          </DataSection>
        </Accordion>
        
        <div className="mt-8">
            <JsonViewer data={data} title="Full Scraped Data (Raw JSON)" initialExpanded={false} />
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
        <Button variant="outline" onClick={() => downloadJson(data, `${filenameBase}.json`)}>
          <FileJson className="h-4 w-4 mr-2" /> Download JSON
        </Button>
        <Button variant="outline" onClick={() => downloadCsv(data, `${filenameBase}.csv`)}>
          <FileText className="h-4 w-4 mr-2" /> Download CSV
        </Button>
        <Button variant="outline" onClick={handleDownloadImages} disabled={!data.images || data.images.length === 0 || isDownloadingImages}>
          {isDownloadingImages ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download Images
        </Button>
      </CardFooter>
    </Card>
  );
}
