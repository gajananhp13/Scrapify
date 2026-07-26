"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Link as LinkIcon, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface Stats {
  visitorCount: number;
  totalScrapedLinks: number;
}

function AnimatedCounter({ value, duration = 2 }: { value: number | undefined; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(safeValue * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(safeValue);
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {(typeof count === "number" && !isNaN(count) ? count : 0).toLocaleString()}
    </span>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  accentColor,
  glowColor,
  delay,
  warning,
}: {
  icon: React.ElementType;
  value: number | undefined;
  label: string;
  sublabel: string;
  accentColor: string;
  glowColor: string;
  delay: number;
  warning?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 flex flex-col items-center text-center px-8 py-6 group"
    >
      {/* Icon badge */}
      <div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${accentColor}18`,
          borderColor: `${accentColor}30`,
          boxShadow: `0 0 20px ${accentColor}15`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
        {/* Animated glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle, ${accentColor}25, transparent 70%)` }}
        />
      </div>

      {/* Number */}
      <div
        className="text-4xl md:text-5xl font-display font-bold mb-1.5 tracking-tight"
        style={{
          background: `linear-gradient(135deg, hsl(210 40% 98%) 0%, ${accentColor} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <AnimatedCounter value={value} />
        {(value ?? 0) >= 1000 && <span className="text-2xl font-semibold opacity-60">+</span>}
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-foreground mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>

      {/* Bottom accent line */}
      <motion.div
        className="mt-4 h-0.5 rounded-full w-8 group-hover:w-16 transition-all duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
      />
    </motion.div>
  );
}

export function StatsDisplay() {
  const [stats, setStats] = useState<Stats>({ visitorCount: 0, totalScrapedLinks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.warning) setWarning(data.warning);
        setStats({
          visitorCount: typeof data.visitorCount === "number" && !isNaN(data.visitorCount) ? data.visitorCount : 0,
          totalScrapedLinks: typeof data.totalScrapedLinks === "number" && !isNaN(data.totalScrapedLinks) ? data.totalScrapedLinks : 0,
        });
        setIsLoading(false);
      })
      .catch(() => {
        setStats({ visitorCount: 0, totalScrapedLinks: 0 });
        setIsLoading(false);
      });

    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementVisitor" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setStats({
              visitorCount: typeof data.visitorCount === "number" && !isNaN(data.visitorCount) ? data.visitorCount : 0,
              totalScrapedLinks: typeof data.totalScrapedLinks === "number" && !isNaN(data.totalScrapedLinks) ? data.totalScrapedLinks : 0,
            });
            sessionStorage.setItem("hasVisited", "true");
          }
        })
        .catch(() => {});
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-around py-8 px-6">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 animate-pulse" />
            <div className="w-24 h-10 bg-muted/50 animate-pulse rounded-lg" />
            <div className="w-16 h-3 bg-muted/30 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {warning && (
        <div className="mx-4 mt-4 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/8 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs text-amber-500/80">Stats not configured: {warning}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-stretch">
        <StatCard
          icon={Users}
          value={stats.visitorCount}
          label="Total Visitors"
          sublabel="Since launch"
          accentColor="hsl(217, 91%, 60%)"
          glowColor="hsl(217, 91%, 60%)"
          delay={0}
        />

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch my-6 bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="md:hidden h-px mx-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        <StatCard
          icon={LinkIcon}
          value={stats.totalScrapedLinks}
          label="Links Scraped"
          sublabel="Across all sessions"
          accentColor="hsl(191, 97%, 55%)"
          glowColor="hsl(191, 97%, 55%)"
          delay={0.1}
        />

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch my-6 bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="md:hidden h-px mx-8 bg-gradient-to-r from-transparent via-border to-transparent" />

        <StatCard
          icon={Activity}
          value={99}
          label="Uptime"
          sublabel="Always available"
          accentColor="hsl(158, 64%, 52%)"
          glowColor="hsl(158, 64%, 52%)"
          delay={0.2}
        />
      </div>
    </div>
  );
}
