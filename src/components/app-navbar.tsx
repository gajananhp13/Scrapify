"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, Home, History, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: Bot },
  { href: "/history", label: "History", icon: History },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div 
        className={cn(
          "pointer-events-auto flex items-center justify-between p-2 pl-6 pr-3 rounded-full transition-all duration-300 border border-white/10 shadow-lg backdrop-blur-md",
          scrolled 
            ? "bg-black/40 w-full max-w-lg shadow-[0_4px_30px_rgba(0,0,0,0.1)]" 
            : "bg-black/20 w-full max-w-2xl"
        )}
      >
        <Link href="/" className="flex items-center gap-2 mr-6 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5 text-white/90 group-hover:text-cyan-400 transition-colors" />
            <motion.div
              className="absolute inset-0 bg-cyan-500/30 rounded-full blur-md"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span className="font-bold text-sm tracking-wide text-white/90 group-hover:text-white transition-colors">
            Scrapify
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full flex items-center gap-2",
                  isActive
                    ? "text-black bg-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 pl-2">
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-white/80">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="w-full bg-[#09090b]/95 backdrop-blur-xl border-b border-white/10 pt-16 pb-8"
              >
                <div className="flex flex-col space-y-4 items-center">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-lg font-medium transition-colors",
                          isActive ? "text-cyan-400" : "text-white/60 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
