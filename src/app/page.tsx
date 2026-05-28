"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, ArrowRight, Zap, Sparkles, FileJson, Layers, Command, Cpu } from "lucide-react";
import Link from "next/link";
import { StatsDisplay } from "@/components/stats-display";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { HeroVisual } from "@/components/hero-visual";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.2, 0.65, 0.3, 0.9] as const,
    },
  },
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-cyan-500/20">
      {/* Ambient Backgrounds */}
      <div className="noise-bg fixed inset-0 z-50 pointer-events-none" />
      <div className="mesh-gradient fixed inset-0 z-0 opacity-40 dark:opacity-20" />
      <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-float-slow pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="container relative z-10 mx-auto px-4 pt-32 pb-24 lg:pb-32">
        {/* Hero Section */}
        <motion.div
          ref={targetRef}
          style={{ opacity, scale, y }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-7xl mx-auto mb-32 pt-4"
        >
          {/* Left Column - Copy & CTA */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div variants={itemVariants} className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:border-cyan-500/50 transition-colors cursor-default group">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Scrapify AI 2.0 is live</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
            >
              The web is your <br />
              <span className="text-gradient-cyan relative">
                database.
                <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-cyan-400 animate-pulse" />
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto lg:mx-0 mb-12 leading-relaxed font-light"
            >
              Turn any website into structured JSON with a simple chat. 
              Powered by next-gen LLMs to understand, summarize, and extract exactly what you need.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full">
              <Link href="/chat">
                <Button size="lg" className="h-14 px-8 text-base font-semibold bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 rounded-full">
                  Start Scraping Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs/blueprint.md">
                <Button size="lg" variant="ghost" className="h-14 px-8 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 rounded-full transition-all">
                  Read the Docs
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Hero Visual Animation */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-5 w-full flex justify-center items-center"
          >
            <HeroVisual />
          </motion.div>
        </motion.div>

        {/* Stats Display (Floating Glass) */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mb-32 relative z-20"
        >
          <div className="glass rounded-2xl p-1">
             <StatsDisplay />
          </div>
        </motion.div>

        {/* Code Preview (Terminal Style) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-40 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#09090b] shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5 backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/60">
                <Command className="w-3 h-3" />
                <span>api.scrapify.io</span>
              </div>
            </div>
            <div className="p-8 overflow-x-auto font-mono text-sm leading-relaxed">
               <pre className="text-gray-300">
                 <span className="text-violet-400">await</span> <span className="text-cyan-400">scrapify</span>.<span className="text-yellow-400">extract</span>(<span className="text-green-400">"https://vercel.com"</span>);
                 <br /><br />
                 <span className="text-gray-500">// Output:</span>
                 <br />
                 <span className="text-purple-400">{"{"}</span>
                 <br />
                 &nbsp;&nbsp;<span className="text-blue-400">"summary"</span>: <span className="text-green-400">"Vercel is a frontend cloud platform..."</span>,
                 <br />
                 &nbsp;&nbsp;<span className="text-blue-400">"tech_stack"</span>: <span className="text-purple-400">["Next.js", "React", "Edge Functions"]</span>,
                 <br />
                 &nbsp;&nbsp;<span className="text-blue-400">"confidence"</span>: <span className="text-cyan-400">0.99</span>
                 <br />
                 <span className="text-purple-400">{"}"}</span>
               </pre>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid (Glass Cards) */}
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {[
            {
              icon: Zap,
              title: "Instant Extraction",
              desc: "Engineered for speed. Extracts data from complex SPAs and dynamic sites in milliseconds."
            },
            {
              icon: Cpu,
              title: "Neural Analysis",
              desc: "Our AI understands context, turning raw HTML into semantic summaries and structured classifications."
            },
            {
              icon: Layers,
              title: "Universal Export",
              desc: "Seamlessly pipe data into your existing stack via webhooks, JSON API, or CSV downloads."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Card className="h-full glass-card border-white/5 hover:border-white/20 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-500">
                    <feature.icon className="w-6 h-6 text-white/70 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Integration Steps */}
        <div className="mb-40">
           <div className="text-center mb-20">
             <h2 className="text-4xl font-bold tracking-tight mb-6">Workflow Simplified</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
               Three steps to unlimited data access.
             </p>
           </div>
           
           <div className="relative">
             {/* Connection Line */}
             <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2" />
             
             <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                  { title: "Input", desc: "Paste URL", icon: Command },
                  { title: "Process", desc: "AI Extraction", icon: Bot },
                  { title: "Data", desc: "JSON Ready", icon: FileJson }
                ].map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                      <step.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </motion.div>
                ))}
             </div>
           </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-20">
          <div className="relative inline-block">
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-30 animate-pulse-slow" />
             <Link href="/chat">
              <Button size="lg" className="relative h-16 px-12 text-lg rounded-full bg-white text-black hover:bg-gray-100 transition-all shadow-2xl">
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
