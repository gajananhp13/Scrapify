import Link from "next/link";
import { Home, Sparkles, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 mesh-bg" aria-hidden="true" />
      <div className="fixed inset-0 -z-10 dot-grid opacity-20" aria-hidden="true" />

      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center border"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--violet)/0.07) 100%)",
              borderColor: "hsl(var(--primary)/0.2)",
              boxShadow: "0 0 40px hsl(var(--primary)/0.08)",
            }}
          >
            <Search className="w-9 h-9 text-primary/70" />
          </div>
        </div>

        {/* Status code */}
        <div
          className="text-7xl font-display font-bold mb-2 tabular-nums"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Page not found</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
              boxShadow: "0 2px 20px hsl(var(--primary)/0.3)",
            }}
          >
            <Home className="w-4 h-4" />
            Go home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl font-semibold text-sm text-foreground border transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
            style={{ borderColor: "hsl(var(--border)/0.6)" }}
          >
            <Sparkles className="w-4 h-4" />
            Try Scraper
          </Link>
        </div>
      </div>
    </div>
  );
}
