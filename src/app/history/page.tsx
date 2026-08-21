"use client";

import { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import type { ScrapeHistoryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, FileText, History, Globe, Calendar, Brain, Tag, Search, X } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrapeResultDisplay } from "@/components/scrape-result-display";
import { downloadHistoryCsv } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const HISTORY_STORAGE_KEY = "scrapifyHistory";

/* ── Empty state ──────────────────────────────── */
function EmptyHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center border mx-auto"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--violet)/0.07) 100%)",
            borderColor: "hsl(var(--primary)/0.2)",
            boxShadow: "0 0 40px hsl(var(--primary)/0.08)",
          }}
        >
          <History className="w-9 h-9 text-primary/60" />
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No scrape history yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
        Every URL you scrape gets saved here automatically. Start with the scraper to build your history.
      </p>
      <Link href="/chat">
        <Button
          className="rounded-2xl h-10 px-6 text-sm font-semibold border-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
            boxShadow: "0 0 24px hsl(var(--primary)/0.3)",
          }}
        >
          Open Scraper
        </Button>
      </Link>
    </motion.div>
  );
}

/* ── History card ─────────────────────────────── */
function HistoryCard({
  item, index, onDelete,
}: {
  item: ScrapeHistoryItem; index: number; onDelete: (id: string) => void;
}) {
  let hostname = item.url;
  try { hostname = new URL(item.url).hostname; } catch {}

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex gap-4 md:gap-6"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center border z-10"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--violet)/0.1) 100%)",
            borderColor: "hsl(var(--primary)/0.25)",
          }}
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
        </div>
        <div
          className="flex-1 w-px mt-2"
          style={{
            background: "linear-gradient(to bottom, hsl(var(--border)/0.6), transparent)",
            minHeight: 24,
          }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:border-primary/25"
        style={{
          background: "linear-gradient(135deg, hsl(var(--card)/0.75) 0%, hsl(var(--card)/0.5) 100%)",
          backdropFilter: "blur(16px)",
          borderColor: "hsl(var(--border)/0.6)",
          boxShadow: "0 4px 20px -4px hsl(226 32% 5%/0.3)",
        }}
      >
        {/* Card header */}
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: "hsl(var(--border)/0.4)" }}
        >
          <div className="min-w-0 flex-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group/link mb-1.5"
            >
              <span className="text-base font-semibold text-foreground truncate group-hover/link:text-primary transition-colors leading-tight">
                {item.title || hostname}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-primary transition-colors shrink-0" />
            </a>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Globe className="w-3 h-3 shrink-0" />
              <span className="truncate">{hostname}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 rounded-xl bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
                  title="View details"
                >
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[92vh] border-border/60"
                style={{
                  background: "hsl(var(--card)/0.95)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold truncate pr-8">
                    {item.title || item.url}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(92vh-8rem)] pr-2">
                  <ScrapeResultDisplay data={item} />
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                style={{
                  background: "hsl(var(--card)/0.95)",
                  backdropFilter: "blur(24px)",
                  borderColor: "hsl(var(--border)/0.6)",
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove{" "}
                    <span className="font-semibold text-foreground">{hostname}</span>{" "}
                    from your history. This can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(item.id)}
                    className="rounded-xl bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Card body */}
        <div className="px-5 py-4 space-y-3">
          {item.aiSummary && (
            <div className="flex items-start gap-2.5">
              <Brain className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {item.aiSummary}
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {item.aiContentType && (
              <span className="badge-primary">
                <Tag className="w-2.5 h-2.5" />
                {item.aiContentType}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {new Date(item.scrapedAt).toLocaleString()}
            </span>
            {/* Mini stats */}
            {[
              { label: "links", value: item.links?.length },
              { label: "images", value: item.images?.length },
            ].filter(s => s.value).map(({ label, value }) => (
              <span key={label} className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{value}</span> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────── */
export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<ScrapeHistoryItem[]>(HISTORY_STORAGE_KEY, []);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const deleteItem = (id: string) =>
    setHistory((prev) => prev.filter((item) => item.id !== id));

  const clearHistory = () => setHistory([]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-primary/20 flex items-center justify-center animate-pulse">
            <History className="w-4 h-4 text-primary/40" />
          </div>
          <p className="text-sm text-muted-foreground">Loading history…</p>
        </div>
      </div>
    );
  }

  const filtered = search.trim()
    ? history.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.url.toLowerCase().includes(search.toLowerCase()) ||
          item.aiContentType?.toLowerCase().includes(search.toLowerCase())
      )
    : history;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 mesh-bg" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 dot-grid opacity-20" aria-hidden="true" />

      <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--violet)/0.1) 100%)",
                  borderColor: "hsl(var(--primary)/0.25)",
                }}
              >
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="heading-md">Scrape History</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {history.length} saved {history.length === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {history.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadHistoryCsv(history)}
                  className="rounded-xl h-9 text-xs border-border/60 hover:border-primary/40 hover:bg-primary/5"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-9 text-xs border-destructive/30 text-destructive hover:bg-destructive/8 hover:border-destructive/50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    style={{
                      background: "hsl(var(--card)/0.95)",
                      backdropFilter: "blur(24px)",
                      borderColor: "hsl(var(--border)/0.6)",
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear all history?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {history.length} saved scrape{history.length !== 1 ? "s" : ""}. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearHistory}
                        className="rounded-xl bg-destructive hover:bg-destructive/90"
                      >
                        Clear all
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Search bar */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, URL, or content type…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-2xl border bg-card/60 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                style={{ borderColor: "hsl(var(--border)/0.6)", backdropFilter: "blur(12px)" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        {history.length === 0 ? (
          <EmptyHistory />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No results for &quot;{search}&quot;</p>
          </motion.div>
        ) : (
          <div className="relative">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  index={i}
                  onDelete={deleteItem}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
