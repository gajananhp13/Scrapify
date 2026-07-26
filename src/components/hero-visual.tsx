"use client";

import { Globe, Brain, FileJson, Zap, Shield, Layers, Activity, Cpu, Sparkles, Database, Code } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

/* ── Chaotic Background Matrix ────────────────── */
function ChaosMatrix() {
  const particles = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      color: ["hsl(var(--primary))", "hsl(var(--cyan))", "hsl(var(--violet))", "hsl(var(--emerald))"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 5
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Warped grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(-45deg, hsl(var(--cyan)) 1px, transparent 1px),
            radial-gradient(circle at 30% 70%, hsl(var(--violet)) 1px, transparent 2px)
          `,
          backgroundSize: "40px 40px, 60px 60px, 80px 80px",
        }}
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          rotate: { duration: 8, repeat: Infinity }
        }}
      />
      
      {/* Floating chaos particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          animate={{
            x: [`${particle.x}%`, `${(particle.x + 50) % 100}%`, `${particle.x}%`],
            y: [`${particle.y}%`, `${(particle.y + 30) % 100}%`, `${particle.y}%`],
            scale: [1, 1.5, 0.5, 1],
            opacity: [0.3, 0.8, 0.1, 0.6],
          }}
          transition={{
            duration: particle.speed * 8,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Fractal lightning */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 30%), radial-gradient(circle at 80% 20%, hsl(var(--cyan)) 0%, transparent 40%)"
        }}
        animate={{ 
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.1, 0.3, 0.05, 0.2, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}

/* ── Morphing Energy Tendrils ─────────────────── */
function EnergyTendril({ 
  path, delay = 0, color = "hsl(var(--cyan))", intensity = 1 
}: {
  path: string; delay?: number; color?: string; intensity?: number;
}) {
  const rm = useReducedMotion();
  if (rm) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 400 400">
      <defs>
        <filter id={`glow-${delay}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <motion.path
        d={path}
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={`url(#glow-${delay})`}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 0.3, 1],
          opacity: [0, intensity, 0.2, intensity * 0.8],
          strokeWidth: [1, 3, 1.5, 2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          delay,
          ease: "easeInOut"
        }}
      />
      
      {/* Energy orb at path end */}
      <motion.circle
        r="4"
        fill={color}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        animate={{
          offsetDistance: ["0%", "100%", "30%", "100%"]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay,
          ease: "easeInOut"
        }}
      >
        <animateMotion dur="4s" repeatCount="indefinite" begin={`${delay}s`} path={path} />
      </motion.circle>
    </svg>
  );
}

/* ── Shapeshifting Node ───────────────────────── */
function ShapeshiftingNode({
  icon: Icon, label, x, y, color, delay, nodeType = "hexagon"
}: {
  icon: React.ElementType; label: string; x: number; y: number; 
  color: string; delay: number; nodeType?: string;
}) {
  const rm = useReducedMotion();
  const shapes = ["hexagon", "diamond", "triangle", "star", "pentagon"];
  const [currentShape, setCurrentShape] = useState(nodeType);

  useEffect(() => {
    if (rm) return;
    const interval = setInterval(() => {
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
    }, 3000 + delay * 1000);
    return () => clearInterval(interval);
  }, [rm, delay]);

  const getShapePath = (shape: string, size = 30) => {
    const s = size;
    switch(shape) {
      case "hexagon": return `M${s},0 L${s*1.5},${s*0.5} L${s*1.5},${s*1.5} L${s},${s*2} L${s*0.5},${s*1.5} L${s*0.5},${s*0.5} Z`;
      case "diamond": return `M${s},0 L${s*2},${s} L${s},${s*2} L0,${s} Z`;
      case "triangle": return `M${s},0 L${s*2},${s*1.7} L0,${s*1.7} Z`;
      case "star": return `M${s},0 L${s*1.2},${s*0.8} L${s*2},${s*0.8} L${s*1.4},${s*1.3} L${s*1.6},${s*2} L${s},${s*1.6} L${s*0.4},${s*2} L${s*0.6},${s*1.3} L0,${s*0.8} L${s*0.8},${s*0.8} Z`;
      case "pentagon": return `M${s},0 L${s*1.9},${s*0.7} L${s*1.5},${s*2} L${s*0.5},${s*2} L${s*0.1},${s*0.7} Z`;
      default: return `M${s},0 L${s*2},0 L${s*2},${s*2} L0,${s*2} Z`;
    }
  };

  return (
    <motion.div
      className="absolute select-none"
      style={{ left: x - 40, top: y - 40 }}
      initial={rm ? {} : { opacity: 0, scale: 0, rotate: -180 }}
      animate={rm ? {} : { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        x: [0, Math.sin(delay) * 10, 0],
        y: [0, Math.cos(delay) * 8, 0]
      }}
      transition={{ 
        delay, 
        duration: 0.8,
        x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
      }}
      whileHover={rm ? {} : { 
        scale: 1.3, 
        rotate: 180,
        transition: { duration: 0.5 }
      }}
    >
      {/* Dynamic shape background */}
      <motion.div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
          <motion.path
            d={getShapePath(currentShape, 20)}
            fill={`${color}20`}
            stroke={color}
            strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 10px ${color})` }}
            animate={rm ? {} : {
              fill: [`${color}20`, `${color}40`, `${color}10`, `${color}30`],
              strokeWidth: [2, 4, 1, 3],
              scale: [1, 1.1, 0.9, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>

        {/* Orbiting elements */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ 
              background: color,
              boxShadow: `0 0 6px ${color}`
            }}
            animate={rm ? {} : {
              rotate: 360,
              scale: [0.5, 1.5, 0.8, 1.2, 0.5]
            }}
            transition={{
              rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
            }}
            style={{
              ...{ background: color, boxShadow: `0 0 6px ${color}` },
              left: "50%",
              top: "50%",
              marginLeft: -4,
              marginTop: -4,
              transformOrigin: `${20 + i * 8}px center`
            }}
          />
        ))}

        {/* Central icon */}
        <motion.div
          className="relative z-10"
          animate={rm ? {} : {
            rotate: [0, 360],
            scale: [1, 1.2, 0.8, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity }
          }}
        >
          <Icon 
            className="w-6 h-6" 
            style={{ 
              color,
              filter: `drop-shadow(0 0 8px ${color})`
            }}
          />
        </motion.div>
      </motion.div>

      {/* Morphing label */}
      <motion.div
        className="text-center mt-2"
        animate={rm ? {} : {
          opacity: [0.7, 1, 0.5, 0.9],
          y: [0, -2, 1, -1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: delay * 0.5
        }}
      >
        <p className="text-xs font-bold text-foreground tracking-wide">{label}</p>
      </motion.div>
    </motion.div>
  );
}

/* ── Quantum Vortex Core ─────────────────────── */
function QuantumVortex() {
  const rm = useReducedMotion();
  
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={rm ? {} : { opacity: 0, scale: 0.1, rotate: -720 }}
      animate={rm ? {} : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Vortex rings */}
      {[60, 80, 100, 120, 140].map((radius, i) => (
        <motion.div
          key={radius}
          className="absolute rounded-full border-2"
          style={{
            width: radius * 2,
            height: radius * 2,
            left: "50%",
            top: "50%",
            marginLeft: -radius,
            marginTop: -radius,
            borderColor: `hsl(var(--${["primary", "cyan", "violet", "emerald", "amber"][i]})/0.${6-i})`,
            borderStyle: i % 2 === 0 ? "solid" : "dashed",
          }}
          animate={rm ? {} : {
            rotate: i % 2 === 0 ? 360 : -360,
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.3, 0.7, 0.2, 0.5, 0.3]
          }}
          transition={{
            rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, delay: i * 0.3 },
            opacity: { duration: 4, repeat: Infinity, delay: i * 0.5 }
          }}
        />
      ))}

      {/* Fractal center */}
      <motion.div
        className="relative rounded-full border-4 backdrop-blur-xl overflow-hidden"
        style={{
          width: 120,
          height: 120,
          background: `
            conic-gradient(from 0deg, hsl(var(--primary)/0.4), hsl(var(--cyan)/0.3), hsl(var(--violet)/0.4), hsl(var(--primary)/0.4)),
            radial-gradient(circle, hsl(var(--card)/0.9), hsl(var(--card)/0.6))
          `,
          borderColor: "hsl(var(--primary)/0.6)",
          boxShadow: `
            0 0 80px hsl(var(--primary)/0.4),
            0 0 160px hsl(var(--cyan)/0.2),
            0 20px 60px hsl(226 32% 5%/0.8),
            inset 0 2px 0 hsl(210 40% 98%/0.1)
          `,
        }}
        animate={rm ? {} : {
          rotate: [0, 360],
          boxShadow: [
            "0 0 80px hsl(var(--primary)/0.4), 0 0 160px hsl(var(--cyan)/0.2), 0 20px 60px hsl(226 32% 5%/0.8), inset 0 2px 0 hsl(210 40% 98%/0.1)",
            "0 0 120px hsl(var(--cyan)/0.6), 0 0 200px hsl(var(--violet)/0.3), 0 20px 60px hsl(226 32% 5%/0.8), inset 0 2px 0 hsl(210 40% 98%/0.1)",
            "0 0 80px hsl(var(--primary)/0.4), 0 0 160px hsl(var(--cyan)/0.2), 0 20px 60px hsl(226 32% 5%/0.8), inset 0 2px 0 hsl(210 40% 98%/0.1)"
          ]
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          boxShadow: { duration: 5, repeat: Infinity }
        }}
      >
        {/* Inner fractals */}
        {[0, 1, 2, 3].map(layer => (
          <motion.div
            key={layer}
            className="absolute inset-2 rounded-full border"
            style={{
              borderColor: `hsl(var(--${["primary", "cyan", "violet", "emerald"][layer]})/0.${8-layer*2})`,
              borderWidth: layer === 0 ? 3 : 1,
              borderStyle: layer % 2 === 0 ? "solid" : "dotted"
            }}
            animate={rm ? {} : {
              rotate: layer % 2 === 0 ? -360 : 360,
              scale: [1, 0.8, 1.2, 0.9, 1]
            }}
            transition={{
              rotate: { duration: 6 + layer * 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, delay: layer * 0.2 }
            }}
          />
        ))}

        {/* Central brain with chaos */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={rm ? {} : {
              scale: [1, 1.3, 0.7, 1.1, 1],
              rotate: [0, 180, 360],
              filter: [
                "drop-shadow(0 0 10px hsl(var(--primary))) hue-rotate(0deg)",
                "drop-shadow(0 0 20px hsl(var(--cyan))) hue-rotate(120deg)",
                "drop-shadow(0 0 15px hsl(var(--violet))) hue-rotate(240deg)",
                "drop-shadow(0 0 10px hsl(var(--primary))) hue-rotate(360deg)"
              ]
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity },
              rotate: { duration: 8, repeat: Infinity },
              filter: { duration: 6, repeat: Infinity }
            }}
          >
            <Brain className="w-12 h-12 text-primary" />
          </motion.div>
        </div>

        {/* Chaos sparks */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(var(--${["primary", "cyan", "violet", "emerald", "amber"][i % 5]}))`,
              boxShadow: `0 0 4px hsl(var(--${["primary", "cyan", "violet", "emerald", "amber"][i % 5]}))`,
              left: "50%",
              top: "50%",
              transformOrigin: `${30 + i * 5}px center`
            }}
            animate={rm ? {} : {
              rotate: 360,
              scale: [0, 2, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, delay: i * 0.2 },
              opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 }
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ── Main Export ─────────────────────────────── */
export function HeroVisual() {
  const mounted = useMounted();
  const rm = useReducedMotion();

  const nodes = [
    { 
      icon: Globe, label: "NEURAL WEB", 
      x: 120, y: 60, 
      color: "hsl(191,97%,55%)", delay: 0.2, nodeType: "hexagon" 
    },
    { 
      icon: Shield, label: "QUANTUM SHIELD", 
      x: 320, y: 100, 
      color: "hsl(258,90%,66%)", delay: 0.4, nodeType: "diamond" 
    },
    { 
      icon: Zap, label: "LIGHTNING CORE", 
      x: 350, y: 280, 
      color: "hsl(38,92%,50%)", delay: 0.6, nodeType: "star" 
    },
    { 
      icon: FileJson, label: "DATA MATRIX", 
      x: 180, y: 340, 
      color: "hsl(158,64%,52%)", delay: 0.8, nodeType: "triangle" 
    },
    { 
      icon: Database, label: "MEMORY VAULT", 
      x: 50, y: 240, 
      color: "hsl(347,77%,50%)", delay: 1.0, nodeType: "pentagon" 
    },
    { 
      icon: Code, label: "CODE FORGE", 
      x: 80, y: 120, 
      color: "hsl(280,80%,60%)", delay: 1.2, nodeType: "star" 
    }
  ];

  const energyPaths = [
    "M 200,200 Q 160,120 120,60",    // to neural web
    "M 200,200 Q 280,140 320,100",   // to quantum shield  
    "M 200,200 Q 320,220 350,280",   // to lightning core
    "M 200,200 Q 190,280 180,340",   // to data matrix
    "M 200,200 Q 100,220 50,240",    // to memory vault
    "M 200,200 Q 120,160 80,120",    // to code forge
  ];

  if (!mounted) {
    return (
      <div className="w-full max-w-lg h-96 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <Brain className="w-10 h-10 text-primary/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto h-96 flex items-center justify-center overflow-hidden perspective-1000">
      {/* Chaotic background */}
      <ChaosMatrix />
      
      {/* Energy tendrils */}
      {energyPaths.map((path, i) => (
        <EnergyTendril
          key={`tendril-${i}`}
          path={path}
          delay={i * 0.4}
          color={nodes[i]?.color || "hsl(var(--primary))"}
          intensity={0.8}
        />
      ))}

      {/* Shapeshifting nodes */}
      {nodes.map((node, i) => (
        <ShapeshiftingNode key={`node-${i}`} {...node} />
      ))}

      {/* Central quantum vortex */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <QuantumVortex />
      </div>

      {/* Chaos status indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold backdrop-blur-md"
        style={{
          background: "linear-gradient(45deg, hsl(var(--card)/0.9), hsl(var(--primary)/0.1))",
          borderColor: "hsl(var(--primary)/0.4)",
          color: "hsl(var(--primary))",
          boxShadow: "0 4px 20px hsl(226 32% 5%/0.4), 0 0 20px hsl(var(--primary)/0.2)",
        }}
        initial={rm ? {} : { opacity: 0, y: 20, scale: 0.8, rotate: -5 }}
        animate={rm ? {} : { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          rotate: 0,
          boxShadow: [
            "0 4px 20px hsl(226 32% 5%/0.4), 0 0 20px hsl(var(--primary)/0.2)",
            "0 4px 20px hsl(226 32% 5%/0.4), 0 0 30px hsl(var(--cyan)/0.3)",
            "0 4px 20px hsl(226 32% 5%/0.4), 0 0 20px hsl(var(--primary)/0.2)"
          ]
        }}
        transition={{ 
          delay: 2, 
          duration: 0.8,
          boxShadow: { duration: 3, repeat: Infinity }
        }}
      >
        <Sparkles className="w-3 h-3 animate-pulse" />
        <span>CHAOS ENGINE ACTIVE</span>
        <Activity className="w-3 h-3" />
      </motion.div>
    </div>
  );
}