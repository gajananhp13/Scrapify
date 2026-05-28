"use client"

import { useState } from "react";
import { UrlInputForm } from "@/components/url-input-form";
import { ScrapeResultDisplay } from "@/components/scrape-result-display";
import type { ScrapedData, ScrapeHistoryItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles } from "lucide-react";
import { generateUniqueId } from "@/lib/utils";
import { ScrapeResultSkeleton } from "@/components/scrape-result-skeleton";
import { motion, AnimatePresence } from "framer-motion";

const HISTORY_STORAGE_KEY = "scrapifyHistory";

export default function ChatPage() {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [history, setHistory] = useLocalStorage<ScrapeHistoryItem[]>(HISTORY_STORAGE_KEY, []);

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
        title: "Scraping Successful!",
        description: `Data fetched from ${url}`,
      });

      // Add to history
      const historyItem: ScrapeHistoryItem = { ...data, id: generateUniqueId() };
      setHistory(prevHistory => [historyItem, ...prevHistory.slice(0, 49)]); // Keep max 50 items

    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Scraping Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto pt-32 pb-8 md:pb-12 relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-bold font-headline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Chat Scraper
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 text-lg md:text-xl max-w-3xl leading-relaxed">
            Enter a URL below to scrape its content. Scrapify will extract data, summarize it, and classify its type using AI.
          </p>
        </motion.header>
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 p-6 md:p-8 border-2 rounded-xl shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
          <UrlInputForm onSubmit={handleScrape} isLoading={isLoading} />
        </motion.section>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="mb-8 border-2">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScrapeResultSkeleton />
            </motion.div>
          )}

          {scrapedData && !isLoading && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ScrapeResultDisplay data={scrapedData} />
            </motion.section>
          )}

          {!isLoading && !scrapedData && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 md:py-20"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block mb-4"
              >
                <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto" />
              </motion.div>
              <p className="text-muted-foreground text-lg md:text-xl">
                Enter a URL to begin scraping. Results will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
