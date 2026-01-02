"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, Home, History, X } from "lucide-react";
import { ThemeToggleButton } from "./theme-toggle-button";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat Scraper", icon: Bot },
  { href: "/history", label: "Scrape History", icon: History },
];

export function AppNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-border/50"
          : "bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6 group" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Bot className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full blur-md"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <motion.span
            className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Scrapify
          </motion.span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md group",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-accent/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <ThemeToggleButton />
            </motion.div>
          </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="relative">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-xs bg-background/95 backdrop-blur-md p-0 border-l border-border/50"
              >
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <Link
                      href="/"
                      className="flex items-center gap-2 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bot className="h-7 w-7 text-primary group-hover:text-primary/80 transition-colors" />
                      <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                        Scrapify
                      </span>
                    </Link>
                    <SheetClose asChild>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon">
                          <X className="h-6 w-6" />
                          <span className="sr-only">Close menu</span>
                        </Button>
                      </motion.div>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 flex flex-col space-y-1 p-4">
                    {navItems.map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-all duration-300 relative group",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                              {item.label}
                              {isActive && (
                                <motion.div
                                  layoutId="mobileActiveTab"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md"
                                  initial={false}
                                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                              )}
                            </Link>
                          </SheetClose>
                        </motion.div>
                      );
                    })}
                  </nav>
                  <div className="p-4 border-t border-border/50">
                    <ThemeToggleButton />
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
