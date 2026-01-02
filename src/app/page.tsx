"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Bot, ArrowRight, Zap, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { StatsDisplay } from "@/components/stats-display";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    [heroRef, featuresRef, howItWorksRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto py-8 md:py-16 relative z-10">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <Bot className="mx-auto h-20 w-20 md:h-24 md:w-24 text-primary mb-6 relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </Bot>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-headline leading-tight"
          >
            Welcome to{" "}
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent animate-gradient">
              Scrapify
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Your intelligent web scraping chatbot. Effortlessly extract, summarize, and classify web content with the power of AI.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link href="/chat">
              <Button
                size="lg"
                className="text-lg px-10 py-7 shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Start Scraping Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Stats Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <StatsDisplay />
        </motion.div>

        {/* Feature Cards */}
        <motion.section
          ref={featuresRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24"
        >
          <motion.div variants={cardVariants}>
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl group-hover:text-primary transition-colors">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="h-7 w-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                  </motion.div>
                  Powerful Scraping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Extract comprehensive data: titles, meta tags, headings, text, links, images, tables, and JSON-LD from any URL.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl group-hover:text-primary transition-colors">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Bot className="h-7 w-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                  </motion.div>
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Leverage LLMs to automatically summarize content, classify its type (blog, product, etc.), and structure it into clean JSON.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer transform hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl group-hover:text-primary transition-colors">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle className="h-7 w-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                  </motion.div>
                  User-Friendly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Enjoy a clean, Notion-like UI with dark/light modes, a chatbot interface, and easy data export (JSON/CSV).
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          ref={howItWorksRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16 md:mb-24"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to transform any web page into structured data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-1 gap-8 items-center max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Input URL",
                  description: "Provide any web page URL through our intuitive chatbot interface.",
                  icon: CheckCircle,
                },
                {
                  step: "2",
                  title: "Scrape & Process",
                  description: "Scrapify fetches the page, extracts key information, and sends it to our AI for analysis.",
                  icon: Sparkles,
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Receive a structured JSON output with summaries, classifications, and all scraped data, ready for viewing or download.",
                  icon: TrendingUp,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start group"
                >
                  <motion.div
                    className="relative mr-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-colors" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                  </motion.div>
                  <div className="flex-1 pt-2">
                    <div className="flex items-center mb-2">
                      <item.icon className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <div className="relative max-w-4xl mx-auto p-12 md:p-16 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20 backdrop-blur-sm">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl blur-xl"
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline">
                Ready to Dive In?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Experience the future of web scraping. Get started with Scrapify and turn web pages into structured, actionable data.
              </p>
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 shadow-lg hover:shadow-accent/30 transition-all duration-300 border-2 border-primary hover:border-accent hover:text-accent hover:bg-accent/10 transform hover:scale-105 hover:-translate-y-1 group"
                >
                  <span className="flex items-center">
                    Try the Chat Scraper
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
