import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star,
  ShoppingCart,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from "lucide-react"
import { products, reviews, amazonUrl } from "../data/products"
import { cartStore } from "../store/cartStore"
import ProductCard from "../components/ProductCard"

interface ProductDetailProps {
  productId: string
  onNavigate: (page: string, params?: Record<string, string>) => void
}

export default function ProductDetail({
  productId,
  onNavigate,
}: ProductDetailProps) {
  const product = products.find((p) => p.id === productId) || products[0]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedModel, setSelectedModel] = useState(product.compatibility[0])
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(
    cartStore.isWishlisted(product.id),
  )
  const [activeTab, setActiveTab] = useState("features")

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const handleAddToCart = () => {
    cartStore.addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-8 font-mono">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-[var(--primary)] transition-colors"
          >
            Home
          </button>
          <ChevronRight size={12} />
          <button
            onClick={() => onNavigate("category", { slug: product.category })}
            className="hover:text-[var(--primary)] transition-colors capitalize"
          >
            {product.category.replace(/-/g, " ")}
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--foreground)] truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left — image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-[var(--border)] mb-4">
              <img
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
              {product.badge && (
                <div className="absolute top-5 left-5 bg-[var(--accent)] text-white text-sm font-display font-800 px-3 py-1.5 rounded-xl">
                  {product.badge}
                </div>
              )}
            </div>
            {/* Thumbs */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white p-1 transition-all ${
                    selectedImage === i
                      ? "border-[var(--primary)] glow-cyan-sm"
                      : "border-[var(--border)]"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <p className="text-xs font-mono text-[var(--primary)] uppercase tracking-widest mb-2">
              {product.brand}
            </p>
            <h1 className="font-display font-800 text-3xl lg:text-4xl text-[var(--foreground)] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              {product.rating !== undefined && (
                <>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating!)
                            ? "star-filled fill-yellow-400"
                            : "star-empty"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--foreground)] font-700">
                    {product.rating}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    ({product.reviewCount?.toLocaleString()} Amazon ratings)
                  </span>
                </>
              )}
              {product.stock !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400">
                  Only {product.stock} left
                </span>
              )}
              <a
                href={amazonUrl(product.asin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[var(--primary)] hover:underline"
              >
                View on Amazon.in
              </a>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8 p-5 glass rounded-2xl border border-[var(--border)]">
              <span className="font-display font-900 text-4xl text-[var(--foreground)]">
                ₹{product.price}
              </span>
              <div>
                <span className="text-lg text-[var(--muted-foreground)] line-through">
                  ₹{product.originalPrice}
                </span>
                <p className="text-green-400 font-display font-700 text-sm">
                  {product.discount}% off — Save ₹
                  {product.originalPrice - product.price}
                </p>
              </div>
            </div>

            {/* Compatibility selector */}
            <div className="mb-6">
              <p className="text-sm font-display font-600 text-[var(--foreground)] mb-3">
                Compatible with:{" "}
                <span className="text-[var(--primary)]">{selectedModel}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.compatibility.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                      selectedModel === model
                        ? "bg-[var(--primary)] text-black font-700 glow-cyan-sm"
                        : "glass border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 glass rounded-xl border border-[var(--border)] px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <Minus size={16} />
                </button>
                <span className="font-mono font-700 text-lg w-8 text-center text-[var(--foreground)]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl font-display font-700 text-base transition-all duration-200 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : "bg-[var(--primary)] text-black glow-cyan-sm"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart
                  </>
                )}
              </motion.button>

              <button
                onClick={() => {
                  cartStore.toggleWishlist(product)
                  setWishlisted(!wishlisted)
                }}
                className={`p-3.5 rounded-2xl border transition-all ${
                  wishlisted
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "glass border-[var(--border)]"
                }`}
              >
                <Heart
                  size={20}
                  className={
                    wishlisted
                      ? "fill-[var(--accent)] text-[var(--accent)]"
                      : "text-[var(--muted-foreground)]"
                  }
                />
              </button>
            </div>

            {/* Instant buy */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("checkout")}
              className="w-full py-3.5 rounded-2xl glass border border-[var(--border)] hover:border-[var(--secondary)] text-[var(--foreground)] font-display font-700 text-base transition-all mb-8"
            >
              <Zap size={16} className="inline mr-2 text-[var(--secondary)]" />
              Buy Now — Instant Checkout
            </motion.button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Shield,
                  label: "Genuine Product",
                  sub: "100% verified",
                },
                {
                  icon: Truck,
                  label: "Fast Delivery",
                  sub: "2-5 business days",
                },
                {
                  icon: RotateCcw,
                  label: "Easy Returns",
                  sub: "30-day policy",
                },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="glass rounded-xl p-3 border border-[var(--border)] text-center"
                >
                  <Icon
                    size={20}
                    className="text-[var(--primary)] mx-auto mb-1.5"
                  />
                  <p className="text-xs font-display font-600 text-[var(--foreground)]">
                    {label}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {sub}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-2 mb-8">
            {["features", "description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-display font-600 capitalize transition-all ${
                  activeTab === tab
                    ? "bg-[var(--primary)] text-black"
                    : "glass border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "features" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 glass rounded-xl p-4 border border-[var(--border)]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/15 flex items-center justify-center">
                    <Check size={14} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-display font-600 text-[var(--foreground)]">
                    {f}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "description" && (
            <div className="glass rounded-2xl p-8 border border-[var(--border)] max-w-3xl">
              <p className="text-[var(--foreground)] leading-relaxed text-base">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-xs font-mono text-[var(--muted-foreground)]">
                NEWorld eStore seller feedback on Amazon.in ·{" "}
                <a
                  href={amazonUrl(product.asin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  read product reviews on Amazon
                </a>
              </p>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 border border-[var(--border)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-display font-700 text-white">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-display font-600 text-sm text-[var(--foreground)]">
                          {r.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {r.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="star-filled fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {r.review}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display font-800 text-2xl text-[var(--foreground)] mb-8">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
