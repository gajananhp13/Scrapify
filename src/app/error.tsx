"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 mesh-bg" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 dot-grid opacity-20" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-8"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center border"
            style={{
              background: "linear-gradient(135deg, hsl(0 84% 60% / 0.1) 0%, hsl(0 84% 60% / 0.06) 100%)",
              borderColor: "hsl(0 84% 60% / 0.25)",
              boxShadow: "0 0 40px hsl(0 84% 60% / 0.1)",
            }}
          >
            <AlertTriangle className="w-9 h-9 text-destructive" />
          </div>
        </motion.div>

        {/* Text */}
        <div
          className="text-7xl font-display font-bold mb-2 tabular-nums"
          style={{
            background: "linear-gradient(135deg, hsl(0 84% 60%) 0%, hsl(0 72% 75%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          500
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Something went wrong</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
          {error.message || "An unexpected error occurred. Don't worry — it's not you."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={reset}
              className="rounded-2xl h-11 px-6 font-semibold border-0"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
                boxShadow: "0 2px 20px hsl(var(--primary)/0.3)",
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </motion.div>
          <Button
            variant="outline"
            asChild
            className="rounded-2xl h-11 px-6 font-semibold border-border/60 hover:border-primary/40 hover:bg-primary/5"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
