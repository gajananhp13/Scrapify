"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Sparkles, X, ArrowRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL — e.g. https://example.com" }),
});

interface UrlInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_EXAMPLES = [
  "https://news.ycombinator.com",
  "https://github.com/trending",
  "https://vercel.com",
];

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: "" },
  });

  const urlValue = form.watch("url");

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values.url);
  }

  function setExample(url: string) {
    form.setValue("url", url, { shouldValidate: false });
  }

  return (
    <div className="w-full space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="space-y-3">
                {/* Input row */}
                <div
                  className={cn(
                    "relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden group",
                    form.formState.errors.url
                      ? "border-destructive/60 shadow-[0_0_0_3px_hsl(0_84%_60%/0.1)]"
                      : "border-border/60 hover:border-border focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                  )}
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--card)/0.8) 0%, hsl(var(--card)/0.6) 100%)",
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {/* Globe icon */}
                  <div className="pl-4 pr-3 shrink-0">
                    <Globe
                      className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        urlValue ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  {/* Input */}
                  <FormControl>
                    <input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                      disabled={isLoading}
                      aria-label="URL to scrape"
                      className={cn(
                        "flex-1 h-14 bg-transparent text-foreground placeholder:text-muted-foreground/50",
                        "text-sm md:text-base font-mono focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                        "selection:bg-primary/20"
                      )}
                    />
                  </FormControl>

                  {/* Clear button */}
                  <AnimatePresence>
                    {urlValue && !isLoading && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => form.setValue("url", "")}
                        className="p-2 mr-1 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                        aria-label="Clear input"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <div className="p-2 shrink-0">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={cn(
                          "h-10 px-5 rounded-xl font-semibold text-sm border-0 transition-all",
                          "disabled:opacity-60 disabled:cursor-not-allowed"
                        )}
                        style={{
                          background: isLoading
                            ? "hsl(var(--muted))"
                            : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
                          boxShadow: isLoading
                            ? "none"
                            : "0 2px 12px hsl(var(--primary)/0.35)",
                          color: "white",
                        }}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Scrape</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>

                  {/* Animated focus gradient border overlay */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)/0.05), hsl(var(--violet)/0.03))",
                    }}
                  />
                </div>

                <FormMessage className="text-xs px-1" />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Quick examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium shrink-0">Try:</span>
        {QUICK_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setExample(example)}
            disabled={isLoading}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 font-mono",
              "text-muted-foreground hover:text-foreground",
              "border-border/40 hover:border-primary/30 hover:bg-primary/5",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {example.replace("https://", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
