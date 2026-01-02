"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Search, X, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
})

interface UrlInputFormProps {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const urlValue = form.watch("url");

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit(values.url)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold flex items-center gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </motion.div>
                Enter URL to Scrape
              </FormLabel>
              <div className="flex items-center space-x-2">
                <div className="relative w-full group">
                  <FormControl>
                    <Input 
                      placeholder="https://example.com" 
                      {...field} 
                      className="text-base md:text-lg py-6 pr-12 border-2 focus:border-primary transition-all duration-300 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm"
                      aria-label="URL to scrape"
                      disabled={isLoading}
                    />
                  </FormControl>
                  {urlValue && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => form.setValue('url', '')}
                        aria-label="Clear input"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="py-6 px-6 md:px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-primary/30 group relative overflow-hidden"
                  >
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="sr-only md:not-sr-only md:ml-2">Scrape</span>
                      </>
                    )}
                    {!isLoading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
