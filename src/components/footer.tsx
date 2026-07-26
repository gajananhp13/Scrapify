"use client";

import Link from "next/link";
import { Bot, Github, Twitter, Linkedin, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/",       label: "Home"         },
  { href: "/chat",   label: "Scraper"      },
  { href: "/history",label: "History"      },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy",  label: "Privacy Policy"  },
  { href: "/terms-of-service",label: "Terms of Service"},
];

const SOCIAL_LINKS = [
  { href: "https://github.com",   icon: Github,   label: "GitHub"   },
  { href: "https://twitter.com",  icon: Twitter,  label: "Twitter"  },
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t overflow-hidden"
      style={{ borderColor: "hsl(var(--border)/0.5)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(to top, hsl(var(--card)/0.6), transparent)",
          backdropFilter: "blur(12px)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(var(--primary)/0.06), transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-10">

          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
                  boxShadow: "0 2px 12px hsl(var(--primary)/0.35)",
                }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                Scrapify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Intelligent web scraping powered by AI. Extract, summarize, and export structured data
              from any public URL — instantly.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5">
              {["AI Summaries", "JSON Export", "No signup"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg border"
                  style={{
                    background: "hsl(var(--muted)/0.5)",
                    borderColor: "hsl(var(--border)/0.5)",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-sm mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-60 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="label-sm mb-4">Connect</p>
            <div className="flex gap-2 mb-6">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border text-muted-foreground hover:text-foreground transition-colors"
                  style={{ borderColor: "hsl(var(--border)/0.6)", background: "hsl(var(--muted)/0.3)" }}
                  whileHover={{ scale: 1.08, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <Link href="/chat">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--violet)/0.9) 100%)",
                  boxShadow: "0 2px 16px hsl(var(--primary)/0.3)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Try Scrapify
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gradient mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Scrapify. Built with Next.js, Genkit AI &amp; Cheerio.
          </p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
