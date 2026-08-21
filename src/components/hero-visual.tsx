"use client";

import { Globe, Brain, FileJson, Zap, Shield, CheckCircle2, ArrowRight, Sparkles, Code2, Database, Link as LinkIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

/* ── Typing animation for the URL bar ───────── */
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

/* ── Animated data row ───────────────────────── */
function DataRow({
  label,
  value,
  color,
  delay,
  wide = false,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
  wide?: boolean;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
      initial={rm ? {} : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="w-1 h-4 rounded-full mt-0.5 shrink-0"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider mb-0.5" style={{ color: `${color}99` }}>
          {label}
        </p>
        <p className={`text-xs font-semibold text-white/90 truncate ${wide ? "max-w-full" : "max-w-[140px]"}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Floating badge ──────────────────────────── */
function FloatingBadge({
  icon: Icon,
  label,
  value,
  color,
  className = "",
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  className?: string;
  delay?: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={`absolute flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border backdrop-blur-xl ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)/0.92), hsl(var(--card)/0.7))",
        borderColor: `${color}30`,
        boxShadow: `0 8px 32px hsl(226 32% 5%/0.5), 0 0 0 1px ${color}15`,
      }}
      initial={rm ? {} : { opacity: 0, scale: 0.85, y: 10 }}
      animate={rm ? {} : {
        opacity: 1,
        scale: 1,
        y: [0, -5, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
    >
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">{label}</p>
        <p className="text-xs font-bold text-white/90">{value}</p>
      </div>
    </motion.div>
  );
}

/* ── Main Export ─────────────────────────────── */
export function HeroVisual() {
  const mounted = useMounted();
  const rm = useReducedMotion();

  if (!mounted) {
    return (
      <div className="w-full max-w-lg h-96 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <Brain className="w-10 h-10 text-primary/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none" style={{ minHeight: 420 }}>

      {/* ── Ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary)/0.12), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* ── Main card ── */}
      <motion.div
        className="relative rounded-3xl border overflow-hidden"
        style={{
          background: "linear-gradient(150deg, hsl(var(--card)/0.85) 0%, hsl(226 32% 8%/0.9) 100%)",
          backdropFilter: "blur(24px)",
          borderColor: "hsl(var(--border)/0.6)",
          boxShadow:
            "0 32px 80px -12px hsl(226 32% 5%/0.7), 0 0 0 1px hsl(210 40% 98%/0.04), inset 0 1px 0 hsl(210 40% 98%/0.06)",
        }}
        initial={rm ? {} : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{
            borderColor: "hsl(var(--border)/0.4)",
            background: "hsl(210 40% 98%/0.02)",
          }}
        >
          <div className="flex gap-1.5">
            {["hsl(0,72%,55%)", "hsl(38,92%,50%)", "hsl(142,71%,45%)"].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div
            className="flex-1 flex items-center gap-2 mx-3 px-3 py-1.5 rounded-lg text-xs font-mono"
            style={{
              background: "hsl(210 40% 98%/0.04)",
              border: "1px solid hsl(210 40% 98%/0.08)",
              color: "hsl(210 40% 98%/0.45)",
            }}
          >
            <Globe className="w-3 h-3 shrink-0" />
            <TypingText text="https://news.ycombinator.com" delay={0.8} />
          </div>
          <motion.div
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--violet)/0.9))",
              boxShadow: "0 2px 12px hsl(var(--primary)/0.4)",
            }}
            initial={rm ? {} : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 0.4 }}
          >
            Scrape
          </motion.div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          {/* Processing indicator */}
          <motion.div
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
            style={{
              background: "hsl(var(--primary)/0.08)",
              border: "1px solid hsl(var(--primary)/0.15)",
            }}
            initial={rm ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.4 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: "hsl(var(--emerald))" }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
              AI extraction complete — 147ms
            </span>
            <Sparkles className="w-3 h-3 ml-auto shrink-0" style={{ color: "hsl(var(--primary))" }} />
          </motion.div>

          {/* Data rows */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "hsl(226 32% 5%/0.6)",
              border: "1px solid hsl(210 40% 98%/0.06)",
            }}
          >
            <div className="px-4 pt-3 pb-1">
              <DataRow
                label="Page Title"
                value="Hacker News — Top Stories"
                color="hsl(191,97%,55%)"
                delay={3.3}
                wide
              />
              <DataRow
                label="AI Summary"
                value="Tech news aggregator with community voting..."
                color="hsl(217,91%,60%)"
                delay={3.6}
                wide
              />
              <DataRow
                label="Content Type"
                value="News / Community"
                color="hsl(258,90%,66%)"
                delay={3.9}
              />
              <DataRow
                label="Links extracted"
                value="83 unique URLs"
                color="hsl(158,64%,52%)"
                delay={4.2}
              />
            </div>

            {/* Export row */}
            <motion.div
              className="flex items-center gap-2 px-4 py-3 mt-1"
              style={{ borderTop: "1px solid hsl(210 40% 98%/0.06)" }}
              initial={rm ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.6, duration: 0.4 }}
            >
              {[
                { icon: FileJson, label: "JSON", color: "hsl(43,96%,56%)" },
                { icon: Database, label: "CSV", color: "hsl(158,64%,52%)" },
                { icon: LinkIcon, label: "Links", color: "hsl(191,97%,55%)" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-default"
                  style={{
                    background: `${color}12`,
                    border: `1px solid ${color}25`,
                    color,
                  }}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
              ))}
              <div className="flex items-center gap-1 ml-auto text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating badges ── */}
      <FloatingBadge
        icon={Zap}
        label="Speed"
        value="147 ms"
        color="hsl(43,96%,56%)"
        className="-left-8 top-16"
        delay={5}
      />
      <FloatingBadge
        icon={Shield}
        label="Privacy"
        value="No storage"
        color="hsl(158,64%,52%)"
        className="-right-6 top-20"
        delay={5.3}
      />
      <FloatingBadge
        icon={Brain}
        label="AI Model"
        value="Genkit AI"
        color="hsl(258,90%,66%)"
        className="-right-8 bottom-20"
        delay={5.6}
      />
    </div>
  );
}
