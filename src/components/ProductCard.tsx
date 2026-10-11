import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Zap, Eye } from "lucide-react";
import type { Product } from "../data/products";
import { cartStore } from "../store/cartStore";

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  index?: number;
}

export default function ProductCard({ product, onNavigate, index = 0 }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(cartStore.isWishlisted(product.id));
  const [addedToCart, setAddedToCart] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartStore.toggleWishlist(product);
    setWishlisted(!wishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartStore.addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group relative flex flex-col rounded-2xl glass border border-[var(--border)] hover:border-[var(--primary)]/40 overflow-hidden card-hover cursor-pointer transition-all duration-300"
      onClick={() => onNavigate("product", { id: product.id })}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--muted)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-display font-700 tracking-wide ${
              product.badge.includes("OFF")
                ? "bg-[var(--accent)] text-white"
                : product.badge === "NEW"
                ? "bg-[var(--secondary)] text-white"
                : "bg-[var(--primary)] text-black"
            }`}>
              {product.badge}
            </span>
          )}
          {product.isNew && !product.badge && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-display font-700 bg-[var(--secondary)] text-white">NEW</span>
          )}
          {product.isBestseller && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-display font-700 bg-yellow-500 text-black">
              <Zap size={9} fill="currentColor" />
              BESTSELLER
            </span>
          )}
        </div>

        {/* Action overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center border border-[var(--border)]"
          >
            <Heart
              size={14}
              className={wishlisted ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--muted-foreground)]"}
            />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onNavigate("product", { id: product.id }); }}
            className="w-8 h-8 rounded-xl glass-strong flex items-center justify-center border border-[var(--border)]"
          >
            <Eye size={14} className="text-[var(--muted-foreground)]" />
          </motion.button>
        </div>

        {/* Quick add (bottom overlay) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              addedToCart
                ? "bg-green-500 text-white"
                : "bg-[var(--primary)] text-black glow-cyan-sm"
            }`}
          >
            {addedToCart ? (
              "✓ Added!"
            ) : (
              <>
                <ShoppingCart size={14} />
                Quick Add
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{product.brand}</p>
        <h3 className="font-display font-600 text-sm text-[var(--foreground)] leading-snug mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
          {product.name}
        </h3>

        {/* Compatibility chips */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.compatibility.slice(0, 2).map((c) => (
            <span key={c} className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
              {c}
            </span>
          ))}
          {product.compatibility.length > 2 && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-[var(--muted)] text-[var(--muted-foreground)]">
              +{product.compatibility.length - 2}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating !== undefined && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating!) ? "star-filled fill-yellow-400" : "star-empty"}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[var(--muted-foreground)]">
            {product.rating} ({product.reviewCount?.toLocaleString()})
          </span>
        </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-800 text-lg text-[var(--foreground)]">₹{product.price}</span>
            <span className="text-xs text-[var(--muted-foreground)] line-through">₹{product.originalPrice}</span>
          </div>
          <span className="text-xs font-display font-700 text-green-400">{product.discount}% off</span>
        </div>
      </div>
    </motion.div>
  );
}
