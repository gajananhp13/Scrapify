"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, Globe, FileJson, Terminal, Cpu, ArrowRight } from "lucide-react";

export function HeroVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through extraction phases
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Web page mock data representing unstructured content
  const webContent = [
    { label: "Shop Title", value: "Retro Kicks Store", type: "title" },
    { label: "Price Tag", value: "$129.99 USD", type: "price" },
    { label: "Stock Counter", value: "Only 3 left in stock!", type: "badge" },
    { label: "Rating Stars", value: "★★★★☆ (4.8/5)", type: "rating" },
  ];

  // Extracted structured JSON data corresponding to steps
  const jsonSteps = [
    `{\n  "status": "idle",\n  "data": null\n}`,
    `{\n  "url": "https://retrokicks.io",\n  "status": "scanning",\n  "scraping_mode": "ai_agent"\n}`,
    `{\n  "url": "https://retrokicks.io",\n  "title": "Retro Kicks Store",\n  "price": 129.99,\n  "currency": "USD",\n  "in_stock": true,\n  "stock_count": 3,\n  "rating": 4.8,\n  "confidence_score": 0.98\n}`
  ];

  return (
    <div 
      className="relative w-full max-w-xl mx-auto xl:max-w-2xl h-[450px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Outer Glows */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-3xl blur-3xl pointer-events-none" />
      
      {/* The Scraping Pipeline Grid */}
      <div className="relative w-full grid grid-cols-1 md:grid-cols-11 gap-4 items-center z-10">
        
        {/* 1. SOURCE WIREFRAME BROWSER (4 Columns) */}
        <motion.div 
          className="col-span-1 md:col-span-5 h-[340px] glass rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -4, borderColor: "rgba(6, 182, 212, 0.3)" }}
        >
          {/* Browser Header */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            <div className="flex items-center gap-1.5 ml-3 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground w-full max-w-[130px] overflow-hidden truncate">
              <Globe className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
              retrokicks.io
            </div>
          </div>

          {/* Browser Content Frame */}
          <div className="relative flex-1 p-4 flex flex-col gap-3.5 bg-black/20 overflow-hidden text-left">
            {/* Animated Scanner Scan-Line */}
            <motion.div 
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-20 shadow-[0_0_12px_#06b6d4]"
              animate={{ 
                top: ["5%", "95%", "5%"] 
              }}
              transition={{ 
                duration: isHovered ? 2.5 : 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />

            {/* Wireframe Page Elements */}
            <div className="h-6 w-20 rounded bg-white/5 border border-white/10" />
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-cyan-400/50">
                👟
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 w-3/4 rounded bg-white/10" />
                <div className="h-2 w-1/2 rounded bg-white/5" />
              </div>
            </div>

            {/* Simulated Live Web Content Lines */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5 flex-1 justify-around">
              {webContent.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-muted-foreground/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    {item.label}
                  </span>
                  <motion.span 
                    className={`font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-foreground transition-all duration-300 ${
                      activeStep === 2 ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/5 shadow-[0_0_8px_rgba(6,182,212,0.15)]" : ""
                    }`}
                  >
                    {item.value}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* Interactive Scanning Overlay */}
            <AnimatePresence>
              {activeStep === 1 && (
                <motion.div 
                  className="absolute inset-0 bg-cyan-500/5 backdrop-blur-[1px] flex items-center justify-center flex-col gap-2 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Cpu className="w-7 h-7 text-cyan-400 animate-spin" style={{ animationDuration: "3s" }} />
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-semibold animate-pulse">EXTRACTING DOM...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 2. CENTRAL FLOW & AI PROCESSOR (3 Columns) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center gap-4 relative min-h-[40px] md:min-h-0">
          
          {/* Animated Connecting Particles (SVG Flow) */}
          <div className="absolute inset-0 pointer-events-none hidden md:block w-[140%] -left-[20%] h-[340px] top-1/2 -translate-y-1/2 overflow-visible">
            <svg className="w-full h-full" viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Spline Path */}
              <path 
                d="M 10 170 Q 100 170 190 170" 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              {/* Flowing Laser Particle */}
              {activeStep >= 1 && (
                <motion.circle
                  r="4"
                  fill="url(#gradient-cyan-violet)"
                  initial={{ cx: 10, cy: 170, opacity: 0 }}
                  animate={{ 
                    cx: [10, 100, 190], 
                    cy: [170, 170, 170],
                    opacity: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 1.8, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              )}
              
              <defs>
                <linearGradient id="gradient-cyan-violet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Glowing AI Core Hub */}
          <motion.div 
            className="relative w-12 h-12 rounded-full flex items-center justify-center z-20 border border-cyan-500/30"
            animate={{ 
              scale: activeStep === 1 ? [1, 1.15, 1] : [1, 1.05, 1],
              boxShadow: activeStep === 1 
                ? ["0 0 15px rgba(6,182,212,0.2)", "0 0 35px rgba(139,92,246,0.5)", "0 0 15px rgba(6,182,212,0.2)"] 
                : ["0 0 15px rgba(6,182,212,0.1)", "0 0 20px rgba(6,182,212,0.2)", "0 0 15px rgba(6,182,212,0.1)"]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Spinning Aura */}
            <div className="absolute inset-0 rounded-full border border-dashed border-violet-400/40 animate-spin" style={{ animationDuration: "8s" }} />
            {/* Backdrop Blur */}
            <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-xl -z-10" />
            
            <Sparkles className={`w-5 h-5 text-cyan-400 transition-colors duration-500 ${
              activeStep === 1 ? "text-violet-400 scale-110" : ""
            }`} />
          </motion.div>

          {/* Simple Arrow Indicator for Mobile */}
          <ArrowRight className="w-5 h-5 text-muted-foreground/40 md:hidden animate-bounce" />
        </div>

        {/* 3. DESTINATION JSON TERMINAL (5 Columns) */}
        <motion.div 
          className="col-span-1 md:col-span-5 h-[340px] glass rounded-xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -4, borderColor: "rgba(139, 92, 246, 0.3)" }}
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-muted-foreground">structured_output.json</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-muted-foreground/80 font-semibold tracking-wide uppercase">READY</span>
            </div>
          </div>

           {/* Terminal Content Frame */}
           <div className="relative flex-1 p-4 bg-black/35 font-mono text-left text-[11px] leading-[1.4] overflow-y-auto overflow-x-hidden text-gray-300">
             {/* Glowing Backdrop Mesh inside the terminal */}
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
             {/* Floating decorative particles */}
             <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-2 left-1/2 w-2 h-2 bg-cyan-400/50 rounded-full animate-float-slow" style={{ animationDelay: "0s" }}></div>
               <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-violet-400/50 rounded-full animate-float-slow" style={{ animationDelay: "1.5s" }}></div>
               <div className="absolute bottom-2 left-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-float-slow" style={{ animationDelay: "0.8s" }}></div>
               <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-violet-400/30 rounded-full animate-float-slow" style={{ animationDelay: "2.2s" }}></div>
             </div>

             <AnimatePresence mode="wait">
               <motion.pre
                 key={activeStep}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.4 }}
                 className="whitespace-pre h-full flex flex-col justify-start"
               >
                 {/* Dynamic colored tokens inside JSON syntax highlighting */}
                 {activeStep === 0 && (
                   <div>
                     <span className="text-gray-500">{"{"}</span>
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"status"</span>: <span className="text-green-400">"idle"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"data"</span>: <span className="text-cyan-400">null</span>
                     <br />
                     <span className="text-gray-500">{"}"}</span>
                   </div>
                 )}

                 {activeStep === 1 && (
                   <div>
                     <span className="text-gray-500">{"{"}</span>
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"url"</span>: <span className="text-green-400">"https://retrokicks.io"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"status"</span>: <span className="text-yellow-400">"extracting"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"scraping_mode"</span>: <span className="text-green-400">"ai_agent"</span>
                     <br />
                     <span className="text-gray-500">{"}"}</span>
                   </div>
                 )}

                 {activeStep === 2 && (
                   <div className="text-[10px] sm:text-[11px] leading-relaxed">
                     <span className="text-gray-500">{"{"}</span>
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"url"</span>: <span className="text-green-400">"https://retrokicks.io"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"title"</span>: <span className="text-cyan-400">"Retro Kicks Store"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"price"</span>: <span className="text-amber-400">129.99</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"currency"</span>: <span className="text-green-400">"USD"</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"in_stock"</span>: <span className="text-cyan-400">true</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"stock_count"</span>: <span className="text-amber-400">3</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"rating"</span>: <span className="text-amber-400">4.8</span>,
                     <br />
                     &nbsp;&nbsp;<span className="text-violet-400">"confidence_score"</span>: <span className="text-emerald-400">0.98</span>
                     <br />
                     <span className="text-gray-500">{"}"}</span>
                   </div>
                 )}
               </motion.pre>
             </AnimatePresence>

             {/* Custom blink cursor to look like live typing - made responsive */}
             <span className="absolute bottom-4 left-[50%] -translate-x-[50%] w-2 h-4 bg-cyan-400 animate-pulse" />
           </div>
        </motion.div>

      </div>
    </div>
  );
}
