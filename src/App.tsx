import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import FeaturedProducts from "./components/FeaturedProducts";
import DealsOfDay from "./components/DealsOfDay";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProductDetail from "./pages/ProductDetail";
import ProductListing from "./pages/ProductListing";
import Checkout from "./pages/Checkout";
import { products } from "./data/products";
import ProductCard from "./components/ProductCard";
import { cartStore } from "./store/cartStore";
import type { WishlistItem } from "./store/cartStore";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type Page =
  | { name: "home" }
  | { name: "products" }
  | { name: "category"; slug: string }
  | { name: "product"; id: string }
  | { name: "checkout" }
  | { name: "wishlist" }
  | { name: "account" }
  | { name: "deals" }
  | { name: "new" }
  | { name: "categories" };

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState<Page>({ name: "home" });
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.className = darkMode ? "" : "light";
  }, [darkMode]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const navigate = (pageName: string, params?: Record<string, string>) => {
    if (pageName === "home") setPage({ name: "home" });
    else if (pageName === "products") setPage({ name: "products" });
    else if (pageName === "category" && params?.slug) setPage({ name: "category", slug: params.slug });
    else if (pageName === "product" && params?.id) setPage({ name: "product", id: params.id });
    else if (pageName === "checkout") setPage({ name: "checkout" });
    else if (pageName === "wishlist") setPage({ name: "wishlist" });
    else if (pageName === "account") setPage({ name: "account" });
    else if (pageName === "deals") setPage({ name: "deals" });
    else if (pageName === "new") setPage({ name: "new" });
    else if (pageName === "categories") setPage({ name: "categories" });
  };

  // Search handler — when searchQuery submitted, show products page
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setPage({ name: "products" });
    }
  }, [searchQuery]);

  const renderPage = () => {
    switch (page.name) {
      case "home":
        return (
          <>
            <Hero onNavigate={navigate} />
            <CategoryGrid onNavigate={navigate} />
            <FeaturedProducts onNavigate={navigate} showTabs />
            <DealsOfDay onNavigate={navigate} />
            {/* Best Sellers */}
            <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-12"
              >
                <div>
                  <p className="text-xs font-mono text-yellow-400 tracking-[0.2em] uppercase mb-3">Most Loved</p>
                  <h2 className="font-display font-800 text-4xl lg:text-5xl text-[var(--foreground)]">
                    Best <span className="text-yellow-400">Sellers</span>
                  </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {products.filter((p) => p.isBestseller).map((p, i) => (
                  <ProductCard key={p.id} product={p} onNavigate={navigate} index={i} />
                ))}
              </div>
            </section>
            <Reviews />
            <Newsletter />
            <Footer onNavigate={navigate} />
          </>
        );

      case "products":
        return (
          <>
            <ProductListing
              onNavigate={navigate}
              searchQuery={searchQuery || undefined}
            />
            <Footer onNavigate={navigate} />
          </>
        );

      case "category":
        return (
          <>
            <ProductListing
              onNavigate={navigate}
              categorySlug={(page as { name: "category"; slug: string }).slug}
            />
            <Footer onNavigate={navigate} />
          </>
        );

      case "product":
        return (
          <>
            <ProductDetail
              productId={(page as { name: "product"; id: string }).id}
              onNavigate={navigate}
            />
            <Footer onNavigate={navigate} />
          </>
        );

      case "checkout":
        return <Checkout onNavigate={navigate} />;

      case "categories":
        return (
          <>
            <div className="min-h-screen bg-[var(--background)] pt-28 pb-16">
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                <div className="mb-12">
                  <p className="text-xs font-mono text-[var(--primary)] tracking-widest uppercase mb-3">Everything We Offer</p>
                  <h1 className="font-display font-800 text-5xl text-[var(--foreground)]">All Categories</h1>
                </div>
                <CategoryGrid onNavigate={navigate} />
              </div>
            </div>
            <Footer onNavigate={navigate} />
          </>
        );

      case "deals":
        return (
          <>
            <div className="min-h-screen bg-[var(--background)] pt-28 pb-16">
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                <div className="mb-12">
                  <p className="text-xs font-mono text-[var(--accent)] tracking-widest uppercase mb-3">Flash Deals</p>
                  <h1 className="font-display font-800 text-5xl text-[var(--foreground)]">Today's <span className="text-[var(--accent)]">Deals</span></h1>
                </div>
                <DealsOfDay onNavigate={navigate} />
              </div>
            </div>
            <Footer onNavigate={navigate} />
          </>
        );

      case "new":
        return (
          <>
            <div className="min-h-screen bg-[var(--background)] pt-28 pb-16">
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                <div className="mb-12">
                  <p className="text-xs font-mono text-[var(--secondary)] tracking-widest uppercase mb-3">Just Arrived</p>
                  <h1 className="font-display font-800 text-5xl text-[var(--foreground)]">New <span className="text-[var(--secondary)]">Arrivals</span></h1>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {products.filter((p) => p.isNew).map((p, i) => (
                    <ProductCard key={p.id} product={p} onNavigate={navigate} index={i} />
                  ))}
                </div>
              </div>
            </div>
            <Footer onNavigate={navigate} />
          </>
        );

      case "wishlist":
        return (
          <WishlistPage onNavigate={navigate} />
        );

      case "account":
        return (
          <AccountPage onNavigate={navigate} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-[var(--background)]">
      <Navbar
        onNavigate={navigate}
        currentPage={page.name}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onCartOpen={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {renderPage()}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}

// Inline lightweight pages

function WishlistPage({ onNavigate }: { onNavigate: (page: string, params?: Record<string, string>) => void }) {
  const [items, setItems] = useState<WishlistItem[]>(() => [...cartStore.getWishlist()]);
  useEffect(() => {
    return cartStore.subscribe(() => {
      setItems([...cartStore.getWishlist()]);
    });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[var(--background)] pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-mono text-[var(--accent)] tracking-widest uppercase mb-3">Saved Items</p>
            <h1 className="font-display font-800 text-5xl text-[var(--foreground)]">My Wishlist</h1>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display font-700 text-xl text-[var(--foreground)] mb-4">Your wishlist is empty</p>
              <button
                onClick={() => onNavigate("products")}
                className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-display font-700"
              >
                Discover Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((item, i) => (
                <ProductCard key={item.product.id} product={item.product} onNavigate={onNavigate} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}

function AccountPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <>
      <div className="min-h-screen bg-[var(--background)] pt-28 pb-16">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <div className="mb-10">
            <h1 className="font-display font-800 text-4xl text-[var(--foreground)]">My Account</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile */}
            <div className="glass rounded-2xl p-6 border border-[var(--border)] flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center mb-4">
                <span className="font-display font-800 text-2xl text-black">R</span>
              </div>
              <h3 className="font-display font-700 text-lg text-[var(--foreground)]">Rahul Sharma</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">rahul@example.com</p>
              <span className="px-3 py-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] text-xs font-mono">NEWorld Pro Member</span>
            </div>

            {/* Stats */}
            {[
              { label: "Total Orders", value: "12", icon: "📦" },
              { label: "Wishlist Items", value: "5", icon: "❤️" },
              { label: "Loyalty Points", value: "2,450", icon: "⭐" },
              { label: "Coupons Available", value: "3", icon: "🎟️" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6 border border-[var(--border)]">
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <p className="font-display font-800 text-2xl text-[var(--foreground)]">{stat.value}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="mt-10 glass rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-display font-700 text-base text-[var(--foreground)]">Recent Orders</h2>
            </div>
            {[
              { id: "NW291847", product: "NEWorld 9H Tempered Glass for iPhone 15 Pro", date: "Sep 2, 2026", status: "Delivered", price: "₹299" },
              { id: "NW291203", product: "XUNDD Beetle Case for OnePlus 12", date: "Aug 28, 2026", status: "In Transit", price: "₹799" },
              { id: "NW290145", product: "20000mAh Power Bank", date: "Aug 15, 2026", status: "Delivered", price: "₹1,999" },
            ].map((order) => (
              <div key={order.id} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-600 text-sm text-[var(--foreground)] truncate">{order.product}</p>
                  <p className="text-xs text-[var(--muted-foreground)] font-mono">{order.id} · {order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-700 ${
                  order.status === "Delivered" ? "bg-green-500/15 text-green-400" : "bg-blue-500/15 text-blue-400"
                }`}>
                  {order.status}
                </span>
                <span className="font-display font-700 text-sm text-[var(--foreground)]">{order.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </>
  );
}
