"use client";
import { Bot, FileJson, Zap, Cpu, Database } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

function Particles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FlowLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative w-16 md:w-24 h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-sm"
        initial={{ left: "0%" }}
        animate={{ left: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400"
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: delay + 0.3,
          ease: "linear",
        }}
      />
    </div>
  );
}

function StageCircle({
  icon: Icon,
  color,
  label,
  desc,
  delay,
  glowColor,
}: {
  icon: React.ElementType;
  color: string;
  label: string;
  desc: string;
  delay: number;
  glowColor: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 14 }}
      className="flex flex-col items-center space-y-3"
    >
      <div className="relative">
        <motion.div
          className={`w-20 h-20 rounded-full ${color} flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-xl relative z-10`}
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-9 h-9 text-white" />
        </motion.div>
        <motion.div
          className={`absolute inset-0 rounded-full ${glowColor} blur-xl -z-0`}
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, delay }}
        />
      </div>
      <h3 className="text-base font-semibold text-foreground">{label}</h3>
      <p className="text-xs text-muted-foreground text-center max-w-[120px] leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

export function HeroVisual() {
  const mounted = useMounted();

  return (
    <div className="relative w-full max-w-xl mx-auto xl:max-w-2xl min-h-[420px] flex items-center justify-center pt-6">
      <div className="relative w-full max-w-3xl">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-[-15%] left-[-5%] w-[450px] h-[450px] bg-cyan-500/8 rounded-full blur-3xl"
            initial={{ y: 0 }}
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-15%] right-[-5%] w-[350px] h-[350px] bg-violet-500/8 rounded-full blur-3xl"
            initial={{ y: 0 }}
            animate={{ y: [12, -12, 12] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[30%] left-[40%] w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-3xl"
            initial={{ y: 0 }}
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1, ease: "easeInOut" }}
          />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <Particles count={15} />

        {/* Main visualization */}
        <div className="relative flex flex-col items-center">
          {/* Top decorative glow orb */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/10 to-violet-500/10 border border-white/5 backdrop-blur-xl flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cpu className="w-6 h-6 text-cyan-300" />
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Three stages with connecting lines */}
          <div className="flex items-center justify-center">
            <StageCircle
              icon={Bot}
              color="bg-cyan-500/15"
              label="Input"
              desc="Enter any URL"
              delay={0.2}
              glowColor="bg-cyan-400/20"
            />

            <div className="hidden sm:block mx-3">
              <FlowLine delay={0} />
            </div>
            <div className="block sm:hidden mx-1">
              <motion.div
                className="w-6 h-px bg-gradient-to-r from-cyan-500/40 via-transparent to-violet-500/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </div>

            <StageCircle
              icon={Zap}
              color="bg-violet-500/15"
              label="Process"
              desc="AI extraction"
              delay={0.4}
              glowColor="bg-violet-400/20"
            />

            <div className="hidden sm:block mx-3">
              <FlowLine delay={0.6} />
            </div>
            <div className="block sm:hidden mx-1">
              <motion.div
                className="w-6 h-px bg-gradient-to-r from-violet-500/40 via-transparent to-emerald-500/40"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </div>

            <StageCircle
              icon={FileJson}
              color="bg-emerald-500/15"
              label="Output"
              desc="Structured JSON"
              delay={0.6}
              glowColor="bg-emerald-400/20"
            />
          </div>

          {/* Bottom info bar */}
          <motion.div
            className="mt-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-muted-foreground">
              <span className="text-white/60">Processing:</span>{" "}
              <motion.span
                className="text-cyan-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                any website
              </motion.span>
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10 mx-1" />
            <span className="text-xs text-emerald-400/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              JSON ready
            </span>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[10%] left-[5%] w-3 h-3 bg-cyan-400/20 rounded-full blur-[2px]"
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[8%] w-4 h-4 bg-violet-400/20 rounded-full blur-[2px]"
            initial={{ y: 0 }}
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[20%] right-[8%] w-5 h-5 bg-emerald-400/15 rounded-full blur-[2px]"
            initial={{ y: 0 }}
            animate={{ y: [-7, 7, -7] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[25%] right-[3%] w-2 h-2 bg-cyan-400/30 rounded-full"
            initial={{ y: 0 }}
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}