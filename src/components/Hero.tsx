import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Shield, Star, Zap } from "lucide-react";
import { products, sellerRating } from "../data/products";

interface HeroProps {
  onNavigate: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.08]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const stats = [
    { value: `${sellerRating.positivePercent}%`, label: "Positive Feedback" },
    { value: `${products.length}`, label: "Products" },
    { value: `${sellerRating.rating}★`, label: "Seller Rating" },
    { value: `${sellerRating.since}`, label: "Serving Since" },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background layers */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 z-0"
      >
        {/* Video-like gradient background (cinematic) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020210] via-[#07070f] to-[#0a0520]" />

        {/* Animated radial gradients simulating light beams */}
        <motion.div
          animate={{
            x: [0, 30, 0, -20, 0],
            y: [0, -20, 10, 20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(0,212,255,0.35) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 10, 0],
            y: [0, 30, -15, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,0.5) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, 30, 0, -20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[25%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(255,77,109,0.4) 0%, transparent 70%)",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Cinematic product image */}
        <div className="absolute right-0 bottom-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1400&h=900&fit=crop&auto=format"
            alt="Premium mobile accessories"
            className="w-full h-full object-cover opacity-15 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070f] via-[#07070f]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Floating product mockup */}
      <motion.div
        style={{
          x: mousePos.x * 0.3,
          y: mousePos.y * 0.3,
        }}
        className="absolute right-[2%] xl:right-[3%] top-[15%] z-10 hidden lg:block"
      >
        <motion.div
          initial={{ opacity: 0, x: 100, rotate: 5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl overflow-hidden glass-strong border border-[var(--border)] glow-cyan shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
              <img
                src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop&auto=format"
                alt="NEWorld Tempered Glass"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 glass-strong rounded-2xl px-3 py-2 border border-[var(--primary)] glow-cyan-sm"
            >
              <div className="flex items-center gap-1">
                <Zap size={14} className="text-[var(--primary)]" fill="currentColor" />
                <span className="text-xs font-display font-700 text-[var(--primary)]">9H HARDNESS</span>
              </div>
            </motion.div>

            {/* Stars badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 right-4 glass-strong rounded-2xl px-3 py-2 border border-[var(--border)]"
            >
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-display font-700 text-[var(--foreground)]">{sellerRating.rating}</span>
                <span className="text-xs text-[var(--muted-foreground)]">/ {sellerRating.totalRatings} ratings</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8 pt-32 pb-20"
      >
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-[var(--border)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] badge-live" />
            <span className="text-xs font-mono text-[var(--muted-foreground)]">FREE SHIPPING ON ORDERS ₹499+</span>
            <Shield size={12} className="text-[var(--primary)]" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-900 text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-[var(--foreground)]">Protect What</span>
            <br />
            <span className="gradient-text text-glow">Matters Most</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-lg text-[var(--muted-foreground)] mb-10 leading-relaxed max-w-lg"
          >
            Premium screen protectors, cases, and mobile accessories — engineered for the devices you depend on.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(0,212,255,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("products")}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[var(--primary)] text-black font-display font-700 text-base glow-cyan-sm transition-all duration-200"
            >
              <Zap size={18} fill="currentColor" />
              Shop Now
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("categories")}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass border border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] font-display font-600 text-base transition-all duration-300"
            >
              <Play size={16} fill="currentColor" />
              Explore Accessories
            </motion.button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex flex-col"
              >
                <span className="font-display font-800 text-2xl text-[var(--primary)] text-glow">{stat.value}</span>
                <span className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[var(--muted-foreground)] font-mono">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-[var(--primary)] to-transparent rounded-full"
        />
      </motion.div>
    </div>
  );
}
