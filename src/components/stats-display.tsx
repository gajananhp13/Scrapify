"use client"

import { useEffect, useState } from 'react';
import { Users, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface Stats {
  visitorCount: number;
  totalScrapedLinks: number;
}

function AnimatedCounter({ value, duration = 2 }: { value: number | undefined; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = safeValue;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  const displayCount = typeof count === 'number' && !isNaN(count) ? count : 0;

  return (
    <span ref={ref} className="tabular-nums">
      {displayCount.toLocaleString()}
    </span>
  );
}

export function StatsDisplay() {
  const [stats, setStats] = useState<Stats>({ visitorCount: 0, totalScrapedLinks: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.warning) {
          setWarning(data.warning);
        }
        setStats({
          visitorCount: typeof data.visitorCount === 'number' && !isNaN(data.visitorCount) ? data.visitorCount : 0,
          totalScrapedLinks: typeof data.totalScrapedLinks === 'number' && !isNaN(data.totalScrapedLinks) ? data.totalScrapedLinks : 0,
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setStats({ visitorCount: 0, totalScrapedLinks: 0 });
        setIsLoading(false);
      });

    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'incrementVisitor' }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setStats({
              visitorCount: typeof data.visitorCount === 'number' && !isNaN(data.visitorCount) ? data.visitorCount : 0,
              totalScrapedLinks: typeof data.totalScrapedLinks === 'number' && !isNaN(data.totalScrapedLinks) ? data.totalScrapedLinks : 0,
            });
            sessionStorage.setItem('hasVisited', 'true');
          }
        })
        .catch(err => console.error('Error incrementing visitor count:', err));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-around py-8 px-4">
        <div className="space-y-2">
           <div className="h-8 w-24 bg-white/10 animate-pulse rounded" />
           <div className="h-4 w-16 bg-white/5 animate-pulse rounded" />
        </div>
        <div className="h-12 w-px bg-white/10" />
        <div className="space-y-2">
           <div className="h-8 w-24 bg-white/10 animate-pulse rounded" />
           <div className="h-4 w-16 bg-white/5 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {warning && (
        <div className="mx-4 mt-4 p-3 border border-amber-500/30 bg-amber-500/10 rounded-md text-xs text-amber-500 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Stats Not Configured: {warning}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-around py-8 px-6 gap-8 md:gap-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center group"
        >
          <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-2 font-mono tracking-tight">
            <AnimatedCounter value={stats.visitorCount} />
          </div>
          <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
            <Users className="h-4 w-4 mr-2" />
            Total Visitors
          </div>
        </motion.div>

        <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center text-center group"
        >
          <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-2 font-mono tracking-tight">
            <AnimatedCounter value={stats.totalScrapedLinks} />
          </div>
          <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-violet-400 transition-colors uppercase tracking-widest">
            <LinkIcon className="h-4 w-4 mr-2" />
            Scraped Links
          </div>
        </motion.div>
      </div>
    </div>
  );
}
