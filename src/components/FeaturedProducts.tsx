import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  title?: string;
  filter?: (p: typeof products[0]) => boolean;
  showTabs?: boolean;
}

const tabs = ["All", "Tempered Glass", "Hydrogel Film", "Cases", "Accessories"];

export default function FeaturedProducts({ onNavigate, title = "Featured Products", showTabs = true }: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All"
    ? products
    : products.filter((p) => {
        if (activeTab === "Tempered Glass") return p.category === "tempered-glass";
        if (activeTab === "Hydrogel Film") return p.category === "hydrogel-film";
        if (activeTab === "Cases") return p.category === "phone-cases";
        if (activeTab === "Accessories") return p.category === "accessories";
        return true;
      });

  return (
    <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-mono text-[var(--primary)] tracking-[0.2em] uppercase mb-3">Handpicked for You</p>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-[var(--foreground)]">{title}</h2>
        </motion.div>
        <button
          onClick={() => onNavigate("products")}
          className="flex items-center gap-2 text-[var(--primary)] hover:gap-3 transition-all duration-200 font-display font-600 text-sm shrink-0"
        >
          View All Products <ArrowRight size={16} />
        </button>
      </div>

      {showTabs && (
        <div className="flex gap-2 mb-10 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-display font-600 transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[var(--primary)] text-black glow-cyan-sm"
                  : "glass border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} onNavigate={onNavigate} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
