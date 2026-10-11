import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, ShoppingCart } from "lucide-react";
import { products } from "../data/products";
import { cartStore } from "../store/cartStore";

interface DealsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

function useCountdown(targetMs: number) {
  const [remaining, setRemaining] = useState(targetMs);
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1_000);
  return { h, m, s };
}

export default function DealsOfDay({ onNavigate }: DealsProps) {
  const deals = products.filter((p) => p.isDeal);
  const { h, m, s } = useCountdown(8 * 3_600_000 + 24 * 60_000 + 37_000);
  const [addedId, setAddedId] = useState<string | null>(null);

  const pad = (n: number) => String(n).padStart(2, "0");

  const handleAdd = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const p = products.find((x) => x.id === id)!;
    cartStore.addToCart(p);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Zap size={16} fill="white" className="text-white" />
            </div>
            <p className="text-xs font-mono text-[var(--accent)] tracking-[0.2em] uppercase">Flash Sale</p>
          </div>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-[var(--foreground)]">
            Deals of the <span className="text-[var(--accent)]">Day</span>
          </h2>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
        >
          <Clock size={16} className="text-[var(--muted-foreground)]" />
          <span className="text-sm text-[var(--muted-foreground)] font-mono">Ends in</span>
          {[pad(h), pad(m), pad(s)].map((unit, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="glass border border-[var(--border)] rounded-lg w-12 h-12 flex items-center justify-center">
                <span className="font-display font-800 text-xl text-[var(--foreground)]">{unit}</span>
              </div>
              {i < 2 && <span className="font-display font-800 text-[var(--muted-foreground)]">:</span>}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Deal cards — horizontal scroll on mobile, grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onNavigate("product", { id: product.id })}
            className="group relative rounded-2xl glass border border-[var(--border)] hover:border-[var(--accent)]/50 overflow-hidden cursor-pointer transition-all duration-300 card-hover"
          >
            {/* Accent glow */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="p-5">
              {/* Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--muted)] mb-5">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[var(--accent)] text-white text-xs font-display font-800 px-2.5 py-1 rounded-lg">
                  {product.discount}% OFF
                </div>
              </div>

              {/* Info */}
              <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{product.brand}</p>
              <h3 className="font-display font-600 text-sm text-[var(--foreground)] line-clamp-2 mb-3 group-hover:text-[var(--accent)] transition-colors">
                {product.name}
              </h3>

              {product.stock !== undefined && (
                <p className="mb-4 text-[10px] font-mono text-[var(--accent)]">Only {product.stock} left in stock</p>
              )}

              {/* Price + CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-800 text-xl text-[var(--foreground)]">₹{product.price}</p>
                  <p className="text-xs text-[var(--muted-foreground)] line-through">₹{product.originalPrice}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={(e) => handleAdd(e, product.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-600 text-sm transition-all duration-200 ${
                    addedId === product.id
                      ? "bg-green-500 text-white"
                      : "bg-[var(--accent)] text-white hover:opacity-90"
                  }`}
                >
                  {addedId === product.id ? "✓" : <ShoppingCart size={14} />}
                  {addedId === product.id ? "Added" : "Add"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
