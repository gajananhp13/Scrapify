"use client";

import { useState } from "react";
import type { ScrapedData, ScrapedLink, ScrapedImage, ScrapedDataTable } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JsonViewer } from "./json-viewer";
import { downloadJson, downloadCsv, downloadImagesAsZip, downloadTableAsXlsx } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, ExternalLink, FileJson, FileText, Loader2, FileSpreadsheet,
  Tags, Heading1, Heading2, Heading3, Type, LinkIcon, ImageIcon, TableIcon,
  Sparkles, Calendar, Globe, ChevronDown, ChevronRight, Brain, Archive,
} from "lucide-react";

/* ── helpers ──────────────────────────────────── */
const sanitize = (name: string) =>
  name.replace(/[^a-z0-9_\-]/gi, "_").toLowerCase();

/* ── Tab button ───────────────────────────────── */
function TabBtn({
  id, label, icon: Icon, active, count, onClick,
}: {
  id: string; label: string; icon: React.ElementType;
  active: boolean; count?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
        active
          ? "text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      ].join(" ")}
    >
      {active && (
        <motion.div
          layoutId="tab-active"
          className="absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
            boxShadow: "0 2px 12px hsl(var(--primary)/0.4)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
      <span className="relative z-10">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={[
            "relative z-10 text-xs px-1.5 py-0.5 rounded-md font-semibold",
            active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Section wrapper ──────────────────────────── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
}

/* ── Info row ─────────────────────────────────── */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-4 py-3 border-b last:border-0"
      style={{ borderColor: "hsl(var(--border)/0.5)" }}
    >
      <span className="text-xs font-semibold text-muted-foreground w-28 shrink-0 mt-0.5 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-foreground flex-1 break-words leading-relaxed">{value}</span>
    </div>
  );
}

/* ── Collapsible heading group ─────────────────── */
function HeadingGroup({ level, texts }: { level: string; texts: string[] }) {
  const [open, setOpen] = useState(level === "h1" || level === "h2");
  if (!texts.length) return null;

  const icons: Record<string, React.ElementType> = {
    h1: Heading1, h2: Heading2, h3: Heading3,
  };
  const Icon = icons[level] ?? Type;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "hsl(var(--border)/0.5)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            {level.toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {texts.length}
          </span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul
              className="px-4 pb-3 space-y-2 border-t"
              style={{ borderColor: "hsl(var(--border)/0.5)" }}
            >
              {texts.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 pt-2">
                  <span
                    className="w-1 h-1 rounded-full mt-2 shrink-0"
                    style={{ background: "hsl(var(--primary))" }}
                  />
                  <span className="text-sm text-foreground leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Tab panels ───────────────────────────────── */

function OverviewPanel({ data }: { data: ScrapedData }) {
  return (
    <Section>
      {/* AI Summary */}
      {data.aiSummary && (
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)/0.06) 0%, hsl(var(--violet)/0.04) 100%)",
            borderColor: "hsl(var(--primary)/0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "hsl(var(--primary)/0.15)" }}
            >
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Summary</span>
            <span className="badge-primary text-[10px] px-2 py-0.5">Genkit AI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.aiSummary}</p>
        </div>
      )}

      {/* Meta info */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "hsl(var(--border)/0.6)" }}
      >
        <div
          className="px-5 py-3 border-b flex items-center gap-2"
          style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.3)" }}
        >
          <Tags className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Meta Information</span>
        </div>
        <div className="px-5">
          <InfoRow label="URL" value={
            <a
              href={data.url} target="_blank" rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-4 font-mono text-xs break-all"
            >
              {data.url}
            </a>
          } />
          {data.meta.description && (
            <InfoRow label="Description" value={data.meta.description} />
          )}
          {data.meta.keywords && (
            <InfoRow label="Keywords" value={
              <div className="flex flex-wrap gap-1.5">
                {data.meta.keywords.split(",").slice(0, 12).map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md border"
                    style={{
                      background: "hsl(var(--muted)/0.5)",
                      borderColor: "hsl(var(--border)/0.5)",
                    }}
                  >
                    {kw.trim()}
                  </span>
                ))}
              </div>
            } />
          )}
          <InfoRow label="Scraped at" value={
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              {new Date(data.scrapedAt).toLocaleString()}
            </span>
          } />
        </div>
      </div>

      {/* Headings */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-1">
          Headings ({Object.values(data.headings).flat().length})
        </p>
        <div className="space-y-2">
          {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((level) =>
            data.headings[level]?.length > 0 ? (
              <HeadingGroup key={level} level={level} texts={data.headings[level]} />
            ) : null
          )}
        </div>
      </div>
    </Section>
  );
}

function ParagraphsPanel({ data }: { data: ScrapedData }) {
  return (
    <Section>
      {data.paragraphs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No paragraphs found.</p>
      ) : (
        <ScrollArea className="h-[480px] pr-3">
          <div className="space-y-4">
            {data.paragraphs.map((p, i) => (
              <div
                key={i}
                className="relative pl-4 py-1 text-sm text-muted-foreground leading-relaxed"
              >
                <div
                  className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full"
                  style={{ background: `hsl(var(--primary)/0.3)` }}
                />
                {p}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Section>
  );
}

function LinksPanel({ data }: { data: ScrapedData }) {
  return (
    <Section>
      {data.links.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No links found.</p>
      ) : (
        <ScrollArea className="h-[480px] pr-3">
          <div className="space-y-1.5">
            {data.links.map((link: ScrapedLink, i: number) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border group transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                style={{ borderColor: "hsl(var(--border)/0.5)" }}
              >
                <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  {link.text && (
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {link.text}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground truncate font-mono">
                    {link.href}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </ScrollArea>
      )}
    </Section>
  );
}

function ImagesPanel({ data, filenameBase, onDownloadImages, isDownloadingImages }: {
  data: ScrapedData; filenameBase: string;
  onDownloadImages: () => void; isDownloadingImages: boolean;
}) {
  return (
    <Section>
      {data.images.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadImages}
            disabled={isDownloadingImages}
            className="rounded-xl border-border/60 hover:border-primary/40 hover:bg-primary/5 text-xs"
          >
            {isDownloadingImages ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Archive className="w-3.5 h-3.5 mr-1.5" />
            )}
            Download ZIP
          </Button>
        </div>
      )}
      {data.images.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No images found.</p>
      ) : (
        <ScrollArea className="h-[480px] pr-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.images.map((img: ScrapedImage, i: number) => (
              <div
                key={i}
                className="group rounded-2xl border overflow-hidden transition-all duration-200 hover:border-primary/30"
                style={{
                  background: "hsl(var(--muted)/0.3)",
                  borderColor: "hsl(var(--border)/0.5)",
                }}
              >
                <div className="aspect-video bg-muted/50 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src || "https://placehold.co/320x180.png"}
                    alt={img.alt || "Scraped image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/320x180.png"; }}
                  />
                </div>
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground truncate">{img.alt || "No alt text"}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Section>
  );
}

function TablesPanel({ data, filenameBase }: { data: ScrapedData; filenameBase: string }) {
  return (
    <Section>
      {data.tables.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No tables found.</p>
      ) : (
        <ScrollArea className="h-[480px] pr-3">
          <div className="space-y-4">
            {data.tables.map((table: ScrapedDataTable, i: number) => (
              <div
                key={table.id || i}
                className="rounded-2xl border overflow-hidden"
                style={{ borderColor: "hsl(var(--border)/0.6)" }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.3)" }}
                >
                  <span className="text-sm font-semibold">{table.caption || `Table ${i + 1}`}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadTableAsXlsx(table, `${filenameBase}_table_${i + 1}.xlsx`)}
                    className="h-7 px-3 text-xs rounded-lg hover:bg-primary/10 hover:text-primary"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                    Excel
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    {table.headers.length > 0 && (
                      <thead style={{ background: "hsl(var(--muted)/0.2)" }}>
                        <tr>
                          {table.headers.map((th, j) => (
                            <th
                              key={j}
                              className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b"
                              style={{ borderColor: "hsl(var(--border)/0.4)" }}
                            >
                              {th}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {table.rows.map((row, k) => (
                        <tr
                          key={k}
                          className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                          style={{ borderColor: "hsl(var(--border)/0.3)" }}
                        >
                          {row.map((td, l) => (
                            <td key={l} className="px-4 py-2.5 text-sm text-foreground">
                              {td}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Section>
  );
}

function JsonLdPanel({ data }: { data: ScrapedData }) {
  return (
    <Section>
      {data.jsonLd.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No JSON-LD found.</p>
      ) : (
        <div className="space-y-3">
          {data.jsonLd.map((item, i) => (
            <JsonViewer key={i} data={item} title={`JSON-LD Item ${i + 1}`} initialExpanded={false} />
          ))}
        </div>
      )}
    </Section>
  );
}

function RawJsonPanel({ data }: { data: ScrapedData }) {
  return <JsonViewer data={data} title="Full Scraped Data (Raw JSON)" initialExpanded={false} />;
}

/* ── Main component ───────────────────────────── */
export function ScrapeResultDisplay({ data }: { data: ScrapedData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDownloadingImages, setIsDownloadingImages] = useState(false);

  if (!data) return null;

  const filenameBase = sanitize(data.title || new URL(data.url).hostname);

  const handleDownloadImages = async () => {
    if (!data.images?.length) return;
    setIsDownloadingImages(true);
    try {
      await downloadImagesAsZip(data.images, `${filenameBase}_images.zip`);
    } catch (e) {
      console.error("Image download failed", e);
    } finally {
      setIsDownloadingImages(false);
    }
  };

  const totalHeadings = Object.values(data.headings).flat().length;

  const tabs = [
    { id: "overview",   label: "Overview",   icon: Sparkles,   count: undefined          },
    { id: "paragraphs", label: "Text",        icon: Type,       count: data.paragraphs.length },
    { id: "links",      label: "Links",       icon: LinkIcon,   count: data.links.length  },
    { id: "images",     label: "Images",      icon: ImageIcon,  count: data.images.length },
    { id: "tables",     label: "Tables",      icon: TableIcon,  count: data.tables.length },
    { id: "jsonld",     label: "JSON-LD",     icon: FileJson,   count: data.jsonLd.length },
    { id: "raw",        label: "Raw JSON",    icon: Archive,    count: undefined          },
  ];

  return (
    <div
      className="rounded-3xl border overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)/0.8) 0%, hsl(var(--card)/0.5) 100%)",
        backdropFilter: "blur(24px)",
        borderColor: "hsl(var(--border)/0.7)",
        boxShadow: "0 24px 80px -12px hsl(226 32% 5%/0.5), inset 0 1px 0 hsl(210 40% 98%/0.04)",
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-6 py-5 border-b"
        style={{ borderColor: "hsl(var(--border)/0.5)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-2 mb-1">
              {data.title || "Untitled Page"}
            </h2>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <Globe className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-xs">{data.url}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
          {/* Badges */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {data.aiContentType && (
              <span className="badge-primary">{data.aiContentType}</span>
            )}
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(data.scrapedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: "Headings",   value: totalHeadings,           color: "hsl(var(--primary))"  },
            { label: "Paragraphs", value: data.paragraphs.length,  color: "hsl(var(--cyan))"     },
            { label: "Links",      value: data.links.length,       color: "hsl(var(--violet))"   },
            { label: "Images",     value: data.images.length,      color: "hsl(var(--emerald))"  },
            { label: "Tables",     value: data.tables.length,      color: "hsl(var(--amber))"    },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{value}</span> {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div
        className="px-4 py-2 border-b overflow-x-auto"
        style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.2)" }}
      >
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <TabBtn
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              active={activeTab === tab.id}
              count={tab.count}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview"   && <OverviewPanel data={data} />}
            {activeTab === "paragraphs" && <ParagraphsPanel data={data} />}
            {activeTab === "links"      && <LinksPanel data={data} />}
            {activeTab === "images"     && (
              <ImagesPanel
                data={data}
                filenameBase={filenameBase}
                onDownloadImages={handleDownloadImages}
                isDownloadingImages={isDownloadingImages}
              />
            )}
            {activeTab === "tables"     && <TablesPanel data={data} filenameBase={filenameBase} />}
            {activeTab === "jsonld"     && <JsonLdPanel data={data} />}
            {activeTab === "raw"        && <RawJsonPanel data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer: download buttons ── */}
      <div
        className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: "hsl(var(--border)/0.5)", background: "hsl(var(--muted)/0.15)" }}
      >
        <span className="text-xs text-muted-foreground">Export data</span>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadJson(data, `${filenameBase}.json`)}
            className="rounded-xl h-8 text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5"
          >
            <FileJson className="w-3.5 h-3.5 mr-1.5" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCsv(data, `${filenameBase}.csv`)}
            className="rounded-xl h-8 text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadImages}
            disabled={!data.images?.length || isDownloadingImages}
            className="rounded-xl h-8 text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5 disabled:opacity-40"
          >
            {isDownloadingImages ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5" />
            )}
            Images
          </Button>
        </div>
      </div>
    </div>
  );
}
