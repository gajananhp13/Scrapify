"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight, Zap, Sparkles, FileJson, Layers, Cpu,
  Globe, Shield, Code2, CheckCircle2, ChevronRight,
  Bot, Star, Terminal, Database
} from "lucide-react";
import Link from "next/link";
import { StatsDisplay } from "@/components/stats-display";
import { HeroVisual } from "@/components/hero-visual";
import { motion } from "framer-motion";

/* ── animation helpers ─────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as any },
});

/* ── Bento feature card ────────────────────── */
function BentoCard({
  icon: Icon, title, desc, accent, className = "", children,
}: {
  icon: React.ElementType; title: string; desc: string;
  accent: string; className?: string; children?: React.ReactNode;
}) {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className={`relative rounded-3xl border overflow-hidden group ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)/0.7) 0%, hsl(var(--card)/0.4) 100%)",
        backdropFilter: "blur(20px)",
        borderColor: "hsl(var(--border)/0.6)",
        boxShadow: "0 8px 32px -8px hsl(226 32% 5%/0.4)",
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${accent}10, transparent 60%)` }}
      />
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border shrink-0"
          style={{ background: `${accent}15`, borderColor: `${accent}25` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
        {children}
      </div>
      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${accent}50, transparent)` }}
      />
    </motion.div>
  );
}

/* ── Step pill ─────────────────────────────── */
function StepPill({
  num, label, sublabel, active,
}: {
  num: string; label: string; sublabel: string; active?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
      active
        ? "border-primary/30 bg-primary/8 shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
        : "border-border/50 bg-card/40 hover:border-border"
    }`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
          active ? "bg-gradient-to-br from-primary to-[hsl(var(--violet)/0.9)] text-white shadow-[0_2px_12px_hsl(var(--primary)/0.4)]" : "bg-muted text-muted-foreground"
        }`}
      >
        {num}
      </div>
      <div>
        <p className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────── */
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Global ambient layer ── */}
      <div className="noise-overlay" aria-hidden="true" />
      <div
        className="fixed inset-0 -z-10 mesh-bg"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 -z-10 dot-grid opacity-30"
        aria-hidden="true"
      />

      {/* ────────────────────────────────────────
          HERO
      ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4">
        <div className="content-container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full border border-border/60 bg-card/50 backdrop-blur-md shadow-sm cursor-default"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(var(--emerald))" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--emerald))" }} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">Scrapify v2.0 — Now with Genkit AI</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="heading-xl mb-6 max-w-2xl"
              >
                Turn any website into{" "}
                <span
                  className="relative inline-block"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--cyan)) 50%, hsl(var(--violet)) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  structured data
                  {/* Underline */}
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(to right, hsl(var(--primary)), hsl(var(--cyan)), hsl(var(--violet)))",
                    }}
                  />
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="body-lg text-lg max-w-xl mb-10"
              >
                Scrapify extracts content, images, links, and tables from any URL — then uses AI to
                summarize and classify everything into clean, exportable JSON.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full justify-center lg:justify-start"
              >
                <Link href="/chat">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      className="h-12 px-7 text-sm font-semibold rounded-2xl border-0"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.85) 100%)",
                        boxShadow: "0 0 30px hsl(var(--primary)/0.35), 0 4px 16px hsl(226 32% 5%/0.4)",
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Scraping Free
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/history">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 text-sm font-semibold rounded-2xl border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
              >
                {[
                  { icon: CheckCircle2, text: "No auth required" },
                  { icon: CheckCircle2, text: "JSON & CSV export" },
                  { icon: CheckCircle2, text: "AI-powered analysis" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-emerald-500" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — hero visual */}
            <motion.div
              className="lg:col-span-5 flex justify-center items-center"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          STATS BAR
      ──────────────────────────────────────── */}
      <section className="relative px-4 pb-24">
        <div className="content-container mx-auto max-w-5xl">
          <motion.div
            {...fadeUp(0)}
            className="rounded-3xl border overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(var(--card)/0.7) 0%, hsl(var(--card)/0.4) 100%)",
              backdropFilter: "blur(24px)",
              borderColor: "hsl(var(--border)/0.7)",
              boxShadow: "0 16px 60px -12px hsl(226 32% 5%/0.5), inset 0 1px 0 hsl(210 40% 98%/0.04)",
            }}
          >
            <StatsDisplay />
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          CODE PREVIEW
      ──────────────────────────────────────── */}
      <section className="relative px-4 pb-28">
        <div className="content-container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)} className="relative group">
            {/* Glow border */}
            <div
              className="absolute -inset-px rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)/0.5), hsl(var(--violet)/0.5))",
                filter: "blur(1px)",
              }}
            />
            <div
              className="relative rounded-3xl overflow-hidden border"
              style={{
                background: "hsl(226 32% 5%)",
                borderColor: "hsl(var(--border)/0.3)",
                boxShadow: "0 24px 80px -12px hsl(226 32% 5%/0.8)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: "hsl(var(--border)/0.3)", background: "hsl(210 40% 98%/0.03)" }}
              >
                <div className="flex gap-1.5">
                  {["hsl(0,72%,60%)", "hsl(38,92%,50%)", "hsl(142,71%,45%)"].map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "hsl(210 40% 98%/0.3)" }}>
                  <Terminal className="w-3 h-3" />
                  scrapify.extract()
                </div>
                <div className="w-16" />
              </div>

              {/* Code body */}
              <div className="p-7 font-mono text-sm leading-7 overflow-x-auto">
                <p>
                  <span style={{ color: "hsl(258,90%,75%)" }}>const</span>{" "}
                  <span style={{ color: "hsl(210,40%,90%)" }}>result</span>{" "}
                  <span style={{ color: "hsl(210,40%,65%)" }}>=</span>{" "}
                  <span style={{ color: "hsl(217,91%,65%)" }}>await</span>{" "}
                  <span style={{ color: "hsl(191,97%,60%)" }}>scrapify</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>.</span>
                  <span style={{ color: "hsl(43,96%,60%)" }}>extract</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>(</span>
                  <span style={{ color: "hsl(158,64%,58%)" }}>&quot;https://example.com&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>)</span>
                </p>
                <br />
                <p style={{ color: "hsl(210,40%,40%)" }}>{"// → Structured output"}</p>
                <p style={{ color: "hsl(258,90%,75%)" }}>{"{"}</p>
                <p className="pl-6">
                  <span style={{ color: "hsl(217,91%,65%)" }}>&quot;title&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>: </span>
                  <span style={{ color: "hsl(158,64%,58%)" }}>&quot;Example Domain&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>,</span>
                </p>
                <p className="pl-6">
                  <span style={{ color: "hsl(217,91%,65%)" }}>&quot;aiSummary&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>: </span>
                  <span style={{ color: "hsl(158,64%,58%)" }}>&quot;A minimal placeholder domain...&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>,</span>
                </p>
                <p className="pl-6">
                  <span style={{ color: "hsl(217,91%,65%)" }}>&quot;aiContentType&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>: </span>
                  <span style={{ color: "hsl(158,64%,58%)" }}>&quot;Informational&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>,</span>
                </p>
                <p className="pl-6">
                  <span style={{ color: "hsl(217,91%,65%)" }}>&quot;links&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>: </span>
                  <span style={{ color: "hsl(191,97%,60%)" }}>Array</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>(12),  </span>
                  <span style={{ color: "hsl(217,91%,65%)" }}>&quot;images&quot;</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>: </span>
                  <span style={{ color: "hsl(191,97%,60%)" }}>Array</span>
                  <span style={{ color: "hsl(210,40%,65%)" }}>(4)</span>
                </p>
                <p style={{ color: "hsl(258,90%,75%)" }}>{"}"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          BENTO FEATURE GRID
      ──────────────────────────────────────── */}
      <section className="relative px-4 pb-28">
        <div className="content-container mx-auto max-w-6xl">
          {/* Section header */}
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <div className="badge-primary inline-flex mb-4">
              <Zap className="w-3 h-3" />
              Features
            </div>
            <h2 className="heading-lg mb-4">Everything you need to extract web data</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Scrapify handles the heavy lifting — from fetching dynamic pages to AI-powered
              summarization — so you get clean data instantly.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <BentoCard
              icon={Zap}
              title="Instant Extraction"
              desc="Fetch HTML, parse metadata, headings, paragraphs, links, images, and tables from any public URL in milliseconds."
              accent="hsl(191,97%,55%)"
              className="lg:row-span-1"
            />
            <BentoCard
              icon={Cpu}
              title="AI Summarization"
              desc="Genkit AI reads scraped content and produces a concise, human-readable summary — no prompting required."
              accent="hsl(217,91%,60%)"
              className="lg:col-span-1"
            />
            <BentoCard
              icon={Globe}
              title="Content Classification"
              desc="Automatically classify each page as News, E-commerce, Blog, Documentation, and more with confidence scores."
              accent="hsl(258,90%,66%)"
            />
            <BentoCard
              icon={FileJson}
              title="JSON & CSV Export"
              desc="Download the full structured dataset as JSON for developers or CSV for analysts — one click away."
              accent="hsl(158,64%,52%)"
            />
            <BentoCard
              icon={Layers}
              title="Image & Table Downloads"
              desc="Bulk download all scraped images as a ZIP archive, or export detected tables directly to Excel (.xlsx)."
              accent="hsl(43,96%,56%)"
            />
            <BentoCard
              icon={Shield}
              title="Scrape History"
              desc="Every scrape is saved locally. Browse, re-export, or delete past sessions. Full privacy — no server storage."
              accent="hsl(347,77%,50%)"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          HOW IT WORKS
      ──────────────────────────────────────── */}
      <section className="relative px-4 pb-28">
        <div className="content-container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — steps */}
            <motion.div {...fadeUp(0)}>
              <div className="badge-violet inline-flex mb-5">
                <ChevronRight className="w-3 h-3" />
                How it works
              </div>
              <h2 className="heading-lg mb-4">
                Three steps to unlimited data
              </h2>
              <p className="body-lg mb-10">
                No configuration, no API keys, no signup. Just paste a URL and get structured data.
              </p>
              <div className="space-y-3">
                <StepPill num="01" label="Paste a URL" sublabel="Any public webpage — articles, shops, docs" active />
                <StepPill num="02" label="AI processes it" sublabel="Cheerio parses HTML, Genkit AI summarizes" />
                <StepPill num="03" label="Download your data" sublabel="JSON, CSV, images ZIP, or Excel tables" />
              </div>
            </motion.div>

            {/* Right — mini preview card */}
            <motion.div
              {...fadeUp(0.15)}
              className="relative"
            >
              <div
                className="rounded-3xl border p-6 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--card)/0.7) 0%, hsl(var(--card)/0.4) 100%)",
                  backdropFilter: "blur(20px)",
                  borderColor: "hsl(var(--border)/0.6)",
                  boxShadow: "0 24px 60px -12px hsl(226 32% 5%/0.5)",
                }}
              >
                {/* Mock URL bar */}
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 border"
                  style={{ background: "hsl(var(--muted)/0.5)", borderColor: "hsl(var(--border)/0.5)" }}
                >
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-mono text-muted-foreground truncate">https://example.com/article</span>
                  <div
                    className="ml-auto px-3 py-1 rounded-lg text-xs font-semibold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--violet)/0.9))" }}
                  >
                    Scrape
                  </div>
                </div>

                {/* Mock result rows */}
                {[
                  { label: "Title", value: "Example Article Heading", color: "hsl(var(--cyan))" },
                  { label: "AI Summary", value: "A comprehensive overview of...", color: "hsl(var(--primary))" },
                  { label: "Content Type", value: "News / Article", color: "hsl(var(--violet))" },
                  { label: "Links found", value: "47 links extracted", color: "hsl(var(--emerald))" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 py-3 border-b last:border-0"
                    style={{ borderColor: "hsl(var(--border)/0.3)" }}
                  >
                    <div className="w-1 h-4 rounded-full mt-0.5 shrink-0" style={{ background: color }} />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────
          CTA BANNER
      ──────────────────────────────────────── */}
      <section className="relative px-4 pb-28">
        <div className="content-container mx-auto max-w-4xl">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl border overflow-hidden text-center px-8 py-16"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)/0.12) 0%, hsl(var(--violet)/0.08) 100%)",
              backdropFilter: "blur(20px)",
              borderColor: "hsl(var(--primary)/0.2)",
              boxShadow: "0 0 80px hsl(var(--primary)/0.1), 0 24px 60px -12px hsl(226 32% 5%/0.4)",
            }}
          >
            {/* Background glow orbs */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 -translate-y-1/2 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, hsl(var(--primary)/0.25), transparent 70%)",
                filter: "blur(40px)",
              }}
              aria-hidden="true"
            />

            <div className="badge-primary inline-flex mx-auto mb-6">
              <Bot className="w-3 h-3" />
              Ready to use
            </div>
            <h2 className="heading-md mb-4 max-w-xl mx-auto">
              Start extracting data from any website right now
            </h2>
            <p className="body-lg max-w-lg mx-auto mb-10">
              No account needed. Paste a URL, get structured JSON. It&apos;s that simple.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chat">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-semibold rounded-2xl border-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
                      boxShadow: "0 0 40px hsl(var(--primary)/0.4), 0 8px 24px hsl(226 32% 5%/0.4)",
                    }}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Launch Scraper
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/history">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base font-semibold rounded-2xl border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  View past scrapes
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
