import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "../data/products";

interface CategoryGridProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function CategoryGrid({ onNavigate }: CategoryGridProps) {
  return (
    <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <p className="text-xs font-mono text-[var(--primary)] tracking-[0.2em] uppercase mb-3">Browse by Type</p>
        <h2 className="font-display font-800 text-4xl lg:text-5xl text-[var(--foreground)]">
          Shop by <span className="gradient-text-cyan">Categories</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate("category", { slug: cat.slug })}
            className="group relative flex flex-col items-center rounded-2xl overflow-hidden glass border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="relative w-full aspect-square overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />

              {/* Icon */}
              <div className="absolute top-3 right-3 glass rounded-xl w-9 h-9 flex items-center justify-center text-lg">
                {cat.icon}
              </div>

              {/* Count */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] font-mono text-white/60">{cat.productCount} items</span>
              </div>
            </div>

            {/* Label */}
            <div className="w-full px-3 py-3 flex items-center justify-between">
              <span className="font-display font-600 text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors text-left leading-tight">
                {cat.name}
              </span>
              <ArrowRight
                size={14}
                className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all duration-200 shrink-0"
              />
            </div>

            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1px rgba(0,212,255,0.3)" }}
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
