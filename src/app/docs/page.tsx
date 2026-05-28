"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Book,
  Terminal,
  Cpu,
  Server,
  Code,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Shield
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const sections = [
  { id: "overview", title: "Overview", icon: Book },
  { id: "quick-start", title: "Quick Start", icon: Zap },
  { id: "usage", title: "Usage Guide", icon: Terminal },
  { id: "api", title: "API Reference", icon: Code },
  { id: "architecture", title: "Architecture", icon: Cpu },
  { id: "deployment", title: "Deployment", icon: Server },
];

function CodeBlock({ code, language = "bash" }: { code: string, language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 group rounded-xl overflow-hidden border border-white/10 bg-[#09090b]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 backdrop-blur-sm">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button 
          onClick={copyToClipboard}
          className="text-muted-foreground hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed text-gray-300">
          {code}
        </pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-cyan-500/20 pt-24 pb-16">
       {/* Ambient Backgrounds */}
       <div className="noise-bg fixed inset-0 z-50 pointer-events-none" />
       <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
       <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

       <div className="container mx-auto px-4 grid lg:grid-cols-[280px_1fr] gap-8 relative z-10">
          
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block sticky top-32 h-[calc(100vh-160px)]">
             <div className="glass rounded-2xl h-full p-4 border border-white/5 flex flex-col">
                <div className="mb-6 px-2">
                   <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                      <Book className="h-5 w-5 text-cyan-400" />
                      Documentation
                   </h2>
                   <p className="text-xs text-muted-foreground">v2.1.0-beta</p>
                </div>
                <ScrollArea className="flex-1">
                   <nav className="space-y-1">
                      {sections.map((section) => (
                         <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${activeSection === section.id 
                               ? "bg-white/10 text-cyan-400 shadow-sm border border-white/5"
                               : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
                         >
                            <section.icon className={`h-4 w-4 transition-colors ${activeSection === section.id ? "text-cyan-400" : "text-muted-foreground group-hover:text-white"}`} />
                            {section.title}
                            {activeSection === section.id && (
                               <motion.div layoutId="active-pill" className="ml-auto">
                                  <ChevronRight className="h-3 w-3" />
                               </motion.div>
                            )}
                         </button>
                      ))}
                   </nav>
                </ScrollArea>
             </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-16 lg:px-8 max-w-4xl">
             
             {/* Overview */}
             <motion.section 
               id="overview"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6"
             >
                <div className="space-y-4 border-b border-white/10 pb-8">
                   <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                      Scrapify Blueprint
                   </h1>
                   <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                      The intelligent web scraping engine that turns raw HTML into structured, semantic JSON data using advanced LLMs.
                   </p>
                   <div className="flex gap-4 pt-2">
                      <Link href="/chat">
                         <Button className="rounded-full bg-white text-black hover:bg-gray-200">
                            Try the Demo
                         </Button>
                      </Link>
                      <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
                         View on GitHub
                      </Button>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                   <div className="glass-card p-6 rounded-xl border border-white/5">
                      <Zap className="h-6 w-6 text-cyan-400 mb-4" />
                      <h3 className="font-semibold mb-2">Smart Extraction</h3>
                      <p className="text-sm text-muted-foreground">Automatically identifies and extracts main content, bypassing ads and navigational clutter.</p>
                   </div>
                   <div className="glass-card p-6 rounded-xl border border-white/5">
                      <Shield className="h-6 w-6 text-violet-400 mb-4" />
                      <h3 className="font-semibold mb-2">Structure & Schema</h3>
                      <p className="text-sm text-muted-foreground">Converts unstructured text into strict JSON schemas tailored to your needs.</p>
                   </div>
                </div>
             </motion.section>

             {/* Quick Start */}
             <motion.section 
               id="quick-start"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6 scroll-mt-32"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-cyan-400" />
                   </div>
                   <h2 className="text-3xl font-bold">Quick Start</h2>
                </div>
                
                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-white/90">Prerequisites</h3>
                   <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                      <li>Node.js 18+</li>
                      <li>OpenAI API Key (or Google Gemini Key)</li>
                      <li>Upstash Redis database (for rate limiting & stats)</li>
                   </ul>
                </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-white/90">Installation</h3>
                   <p className="text-muted-foreground">Clone the repository and install dependencies.</p>
                   <CodeBlock code={`git clone https://github.com/yourusername/scrapify.git\ncd scrapify\nnpm install`} />
                </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-white/90">Configuration</h3>
                   <p className="text-muted-foreground">Create a <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-white">.env.local</code> file in the root directory.</p>
                   <CodeBlock code={`# AI Configuration\nGOOGLE_GENERATIVE_AI_API_KEY=your_key_here\n\n# Database (Upstash Redis)\nUPSTASH_REDIS_REST_URL=your_url\nUPSTASH_REDIS_REST_TOKEN=your_token\n\n# App Config\nNEXT_PUBLIC_APP_URL=http://localhost:3000`} language="env" />
                </div>
             </motion.section>

             {/* Usage Guide */}
             <motion.section 
               id="usage"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6 scroll-mt-32"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Terminal className="h-5 w-5 text-violet-400" />
                   </div>
                   <h2 className="text-3xl font-bold">Usage Guide</h2>
                </div>
                
                <p className="text-muted-foreground text-lg">Scrapify functions as an intelligent agent. You don't need to write selectors or inspect HTML.</p>

                <div className="glass p-6 rounded-xl border-l-4 border-cyan-500">
                   <h4 className="font-semibold text-white mb-2">Basic Scraping</h4>
                   <p className="text-muted-foreground mb-4">Simply paste a URL into the chat interface.</p>
                   <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-cyan-300">
                      "Scrape https://techcrunch.com"
                   </div>
                   <div className="mt-4 text-sm text-muted-foreground">
                      <strong>What happens:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                         <li>The engine fetches raw HTML (bypassing basic anti-bot checks).</li>
                         <li>DOM cleaning removes scripts, styles, and ads.</li>
                         <li>LLM classifies the page type (Article, Product, Listing).</li>
                         <li>Summary and structured entities are extracted.</li>
                      </ol>
                   </div>
                </div>
             </motion.section>

             {/* API Reference */}
             <motion.section 
               id="api"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6 scroll-mt-32"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Code className="h-5 w-5 text-amber-400" />
                   </div>
                   <h2 className="text-3xl font-bold">API Reference</h2>
                </div>

                <p className="text-muted-foreground">Integrate Scrapify directly into your backend services.</p>

                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold font-mono">POST</span>
                      <code className="bg-white/5 px-2 py-1 rounded text-sm text-white font-mono">/api/scrape</code>
                   </div>
                   
                   <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mt-6">Request Body</h4>
                   <CodeBlock code={`{\n  "url": "https://example.com/product/123",\n  "format": "json" // optional\n}`} language="json" />
                   
                   <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider mt-6">Response</h4>
                   <CodeBlock code={`{\n  "success": true,\n  "data": {\n    "title": "Product Name",\n    "price": "$99.00",\n    "description": "...",\n    "classification": "E-commerce Product",\n    "summary": "High-performance widget..."
  }
}`} language="json" />
                </div>
             </motion.section>

             {/* Architecture */}
             <motion.section 
               id="architecture"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6 scroll-mt-32"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-pink-400" />
                   </div>
                   <h2 className="text-3xl font-bold">Architecture</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <Card className="glass-card p-6 border-white/5">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                         <Zap className="h-4 w-4 text-yellow-400" /> Frontend
                      </h4>
                      <p className="text-sm text-muted-foreground">Built with Next.js 14 App Router, Tailwind CSS, and Framer Motion for a fluid, glassmorphic UI.</p>
                   </Card>
                   <Card className="glass-card p-6 border-white/5">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                         <Server className="h-4 w-4 text-blue-400" /> Backend
                      </h4>
                      <p className="text-sm text-muted-foreground">Serverless Edge Functions handling scraping requests and proxying to avoid CORS issues.</p>
                   </Card>
                   <Card className="glass-card p-6 border-white/5">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                         <Cpu className="h-4 w-4 text-purple-400" /> AI Engine
                      </h4>
                      <p className="text-sm text-muted-foreground">Powered by Google Gemini Pro (via Vercel AI SDK) for context-aware content analysis.</p>
                   </Card>
                   <Card className="glass-card p-6 border-white/5">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                         <Terminal className="h-4 w-4 text-green-400" /> Storage
                      </h4>
                      <p className="text-sm text-muted-foreground">Upstash Redis for persisting session history, rate limiting, and analytics.</p>
                   </Card>
                </div>
             </motion.section>
             
             {/* Deployment */}
             <motion.section 
               id="deployment"
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={fadeIn}
               className="space-y-6 scroll-mt-32 pb-32"
             >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-white" />
                   </div>
                   <h2 className="text-3xl font-bold">Deployment</h2>
                </div>

                <div className="glass p-8 rounded-xl border border-white/5">
                   <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                      <li><strong className="text-white">Fork this repository</strong> to your GitHub account.</li>
                      <li><strong className="text-white">Import project</strong> into Vercel.</li>
                      <li><strong className="text-white">Add Environment Variables</strong> in the Vercel Dashboard (Project Settings).</li>
                      <li><strong className="text-white">Deploy</strong>.</li>
                   </ol>
                   <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200">
                      <strong>Note:</strong> For long-running scrapes (&gt;10s), Vercel's hobby plan might time out. Consider using Vercel Pro or deploying the scraper worker separately.
                   </div>
                </div>
             </motion.section>

          </main>
       </div>
    </div>
  );
}
