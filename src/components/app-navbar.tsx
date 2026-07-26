"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, Home, History, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Scraper", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none"
    >
      <motion.div
        animate={{
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(12px) saturate(150%)",
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-2",
          "px-2 py-2 rounded-2xl border transition-all duration-300 ease-out",
          scrolled
            ? "bg-card/80 border-border/80 shadow-[0_8px_32px_-8px_hsl(226_32%_5%/0.5)] w-full max-w-md"
            : "bg-card/40 border-border/40 w-full max-w-2xl shadow-[0_4px_24px_-4px_hsl(226_32%_5%/0.3)]"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 pl-3 pr-2 group shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative flex items-center justify-center w-7 h-7">
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-primary/30 blur-md"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--violet))] flex items-center justify-center shadow-[0_2px_8px_hsl(var(--primary)/0.4)]">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
            Scrapify
          </span>
        </Link>

        {/* Desktop Nav Pills */}
        <nav className="hidden md:flex items-center gap-0.5 bg-muted/40 rounded-xl p-1 border border-border/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 select-none",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--violet)/0.9)] shadow-[0_2px_8px_hsl(var(--primary)/0.4)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 pr-1">
          <Link href="/chat" className="hidden md:block">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="h-8 px-4 text-xs font-semibold rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--violet)/0.9)] border-0 shadow-[0_2px_12px_hsl(var(--primary)/0.35)] hover:shadow-[0_4px_20px_hsl(var(--primary)/0.5)] transition-shadow"
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                Try Free
              </Button>
            </motion.div>
          </Link>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl hover:bg-muted/60 text-muted-foreground"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="top"
                className="w-full bg-card/95 backdrop-blur-2xl border-b border-border pt-20 pb-10"
              >
                {/* Mobile Logo in sheet */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--violet))] flex items-center justify-center shadow-[0_2px_12px_hsl(var(--primary)/0.4)]">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-foreground">Scrapify</span>
                </div>

                <nav className="flex flex-col items-center gap-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 w-full max-w-xs px-5 py-3.5 rounded-2xl text-base font-semibold transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary/15 to-[hsl(var(--violet)/0.1)] text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 flex justify-center">
                  <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="h-12 px-8 rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--violet)/0.9)] border-0 shadow-[0_4px_20px_hsl(var(--primary)/0.4)] font-semibold">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Scraping Free
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
