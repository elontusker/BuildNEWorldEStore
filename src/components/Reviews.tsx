import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { reviews, sellerRating } from "../data/products";

export default function Reviews() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + reviews.length) % reviews.length);
  const next = () => setActive((a) => (a + 1) % reviews.length);

  return (
    <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-xs font-mono text-[var(--primary)] tracking-[0.2em] uppercase mb-3">What Our Customers Say</p>
        <h2 className="font-display font-800 text-4xl lg:text-5xl text-[var(--foreground)]">
          Serving Customers <span className="gradient-text">Since {sellerRating.since}</span>
        </h2>

        {/* Aggregate rating */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={22} className={i < Math.round(sellerRating.rating) ? "fill-yellow-400 text-yellow-400" : "text-yellow-400/40"} />
            ))}
          </div>
          <span className="font-display font-800 text-2xl text-[var(--foreground)]">{sellerRating.rating}</span>
          <span className="text-[var(--muted-foreground)] text-sm">
            {sellerRating.positivePercent}% positive · {sellerRating.totalRatings} Amazon.in seller ratings
          </span>
        </div>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main review card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-strong rounded-3xl p-8 md:p-12 border border-[var(--border)] relative overflow-hidden"
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, var(--primary) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
            />

            <Quote size={40} className="text-[var(--primary)] opacity-30 mb-6" />

            <p className="text-lg md:text-xl text-[var(--foreground)] leading-relaxed mb-8 font-light">
              "{reviews[active].review}"
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] bg-[var(--secondary)] flex items-center justify-center font-display font-700 text-white">
                  {reviews[active].name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display font-700 text-[var(--foreground)]">{reviews[active].name}</p>
                    {reviews[active].verified && (
                      <CheckCircle size={14} className="text-[var(--primary)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)]">Amazon.in · {reviews[active].date}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex mb-1">
                  {Array.from({ length: reviews[active].rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] font-mono max-w-[200px] text-right truncate">Seller feedback</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-xl glass border border-[var(--border)] hover:border-[var(--primary)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? "w-8 h-2 bg-[var(--primary)]" : "w-2 h-2 bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-xl glass border border-[var(--border)] hover:border-[var(--primary)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: "Genuine Products", icon: "🔒" },
            { label: "30-Day Returns", icon: "↩️" },
            { label: "Fast Delivery", icon: "⚡" },
            { label: "Secure Payments", icon: "🛡️" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 glass rounded-2xl p-4 border border-[var(--border)]">
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-display font-600 text-sm text-[var(--foreground)]">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
