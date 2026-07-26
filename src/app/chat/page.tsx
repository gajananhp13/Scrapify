"use client";

import { useState } from "react";
import { UrlInputForm } from "@/components/url-input-form";
import { ScrapeResultDisplay } from "@/components/scrape-result-display";
import type { ScrapedData, ScrapeHistoryItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { generateUniqueId } from "@/lib/utils";
import { ScrapeResultSkeleton } from "@/components/scrape-result-skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Globe, FileJson, Cpu, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const HISTORY_STORAGE_KEY = "scrapifyHistory";

/* ── Capability pill ──────────────────────── */
function CapabilityPill({ icon: Icon, label, color }: {
  icon: React.ElementType; label: string; color: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium"
      style={{
        background: `${color}10`,
        borderColor: `${color}25`,
        color,
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}

/* ── Empty state ──────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 md:py-28 text-center"
    >
      {/* Animated icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-6"
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center border"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--violet)/0.08) 100%)",
            borderColor: "hsl(var(--primary)/0.2)",
            boxShadow: "0 0 40px hsl(var(--primary)/0.1)",
          }}
        >
          <Sparkles className="w-9 h-9 text-primary" />
        </div>
        {/* Orbiting dot */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
          style={{ background: "hsl(var(--cyan))", boxShadow: "0 0 8px hsl(var(--cyan))" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <h3 className="text-xl font-semibold text-foreground mb-2">Ready to scrape</h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        Paste any public URL above and Scrapify will extract all its content, then AI-summarize it for you.
      </p>

      {/* Capabilities row */}
      <div className="flex flex-wrap justify-center gap-2 mt-8">
        <CapabilityPill icon={Globe}    label="Fetch & Parse"   color="hsl(191,97%,55%)" />
        <CapabilityPill icon={Cpu}      label="AI Summarize"    color="hsl(217,91%,60%)" />
        <CapabilityPill icon={FileJson} label="Export JSON/CSV" color="hsl(158,64%,52%)" />
      </div>
    </motion.div>
  );
}

/* ── Error state ──────────────────────────── */
function ErrorState({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border px-6 py-5 flex items-start gap-4"
      style={{
        background: "linear-gradient(135deg, hsl(0 84% 60% / 0.06) 0%, hsl(0 84% 60% / 0.03) 100%)",
        borderColor: "hsl(0 84% 60% / 0.25)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "hsl(0 84% 60% / 0.12)" }}
      >
        <AlertTriangle className="w-5 h-5 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-destructive mb-1">Scrape failed</p>
        <p className="text-sm text-muted-foreground leading-relaxed break-words">{message}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────── */
export default function ChatPage() {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setHistory] = useLocalStorage<ScrapeHistoryItem[]>(HISTORY_STORAGE_KEY, []);

  const handleScrape = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setScrapedData(data as ScrapedData);
      toast({
        title: "Scrape successful",
        description: `Extracted data from ${new URL(url).hostname}`,
      });

      const historyItem: ScrapeHistoryItem = { ...data, id: generateUniqueId() };
      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);
    } catch (err: any) {
      const msg = err.message || "An unknown error occurred.";
      setError(msg);
      toast({ variant: "destructive", title: "Scraping failed", description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 mesh-bg" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 dot-grid opacity-20" aria-hidden="true" />

      <div className="container mx-auto max-w-4xl px-4 pt-28 pb-16">
        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--violet)/0.1) 100%)",
                borderColor: "hsl(var(--primary)/0.25)",
                boxShadow: "0 0 20px hsl(var(--primary)/0.15)",
              }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="heading-md">Web Scraper</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">
            Enter a URL to extract its content — headings, paragraphs, links, images, tables — then get an
            AI-generated summary and content classification.
          </p>
        </motion.div>

        {/* ── Input card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border p-6 mb-8"
          style={{
            background: "linear-gradient(135deg, hsl(var(--card)/0.8) 0%, hsl(var(--card)/0.5) 100%)",
            backdropFilter: "blur(24px)",
            borderColor: "hsl(var(--border)/0.7)",
            boxShadow: "0 8px 40px -8px hsl(226 32% 5%/0.4), inset 0 1px 0 hsl(210 40% 98%/0.04)",
          }}
        >
          <UrlInputForm onSubmit={handleScrape} isLoading={isLoading} />
        </motion.div>

        {/* ── Dynamic content area ── */}
        <AnimatePresence mode="wait">
          {error && (
            <ErrorState key="error" message={error} onDismiss={() => setError(null)} />
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <ScrapeResultSkeleton />
            </motion.div>
          )}

          {scrapedData && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScrapeResultDisplay data={scrapedData} />
            </motion.div>
          )}

          {!isLoading && !scrapedData && !error && (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
