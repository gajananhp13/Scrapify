"use client"

import { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import type { ScrapeHistoryItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, FileText, Eye } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { downloadHistoryCsv } from "@/lib/utils";
import { ScrapeResultDisplay } from "@/components/scrape-result-display"; // To view details
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


const HISTORY_STORAGE_KEY = "scrapifyHistory";

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<ScrapeHistoryItem[]>(HISTORY_STORAGE_KEY, []);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true); // Ensure localStorage is accessed only on client-side
  }, []);

  const clearHistory = () => {
    setHistory([]);
  };

  const deleteItem = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };
  
  if (!mounted) {
    // You can return a loading skeleton here if preferred
    return <div className="text-center py-10"><p className="text-muted-foreground text-lg">Loading history...</p></div>;
  }

  return (
    <div className="container mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Scrape History</h1>
            <p className="text-muted-foreground mt-2 text-lg">
            Review your past web scraping activities.
            </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
            {history.length > 0 && (
                 <Button variant="outline" onClick={() => downloadHistoryCsv(history)}>
                    <FileText className="h-4 w-4 mr-2" /> Export CSV
                </Button>
            )}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={history.length === 0}>
                    <Trash2 className="h-4 w-4 mr-2" /> Clear All History
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will permanently delete all your scrape history. This cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90">
                        Yes, clear history
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-16 w-16 text-muted-foreground mx-auto mb-4"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
          <p className="text-xl text-muted-foreground">Your scrape history is empty.</p>
          <p className="text-muted-foreground mt-2">Start scraping on the <Link href="/chat" className="text-primary hover:underline">Chat page</Link> to build your history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl md:text-2xl break-all line-clamp-1">
                            <Link href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary flex items-center gap-1">
                                {item.title || new URL(item.url).hostname} <ExternalLink className="h-4 w-4 shrink-0" />
                            </Link>
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            Scraped on: {new Date(item.scrapedAt).toLocaleString()}
                        </CardDescription>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete item</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Delete this scrape entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the history for <span className="font-semibold">{item.url}</span>? This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteItem(item.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                {item.aiSummary && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    <strong>Summary:</strong> {item.aiSummary}
                  </p>
                )}
                {item.aiContentType && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Type:</strong> <span className="font-semibold text-primary">{item.aiContentType}</span>
                  </p>
                )}
                 {!item.aiSummary && !item.aiContentType && (
                    <p className="text-sm text-muted-foreground italic">No AI analysis available for this entry.</p>
                )}
              </CardContent>
              <CardFooter>
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                        <DialogTitle className="text-2xl truncate">Details for: {item.title || item.url}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[calc(90vh-10rem)] pr-6">
                             <ScrapeResultDisplay data={item} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
