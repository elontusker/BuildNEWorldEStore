import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon, Zap, ChevronDown } from "lucide-react";
import { cartStore } from "../store/cartStore";

interface NavbarProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  currentPage: string;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  onCartOpen: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export default function Navbar({ onNavigate, darkMode, setDarkMode, onCartOpen, searchQuery, setSearchQuery }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    const unsub = cartStore.subscribe(() => {
      setCartCount(cartStore.getCartCount());
      setWishlistCount(cartStore.getWishlist().length);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Categories", page: "categories", hasDropdown: true },
    { label: "Deals", page: "deals" },
    { label: "New Arrivals", page: "new" },
  ];

  const categories = [
    "Tempered Glass", "Hydrogel Film", "Watch Protectors",
    "Phone Cases", "Accessories", "Refurbished", "Custom Cut",
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-strong shadow-[0_2px_40px_rgba(0,0,0,0.4)]" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center glow-cyan-sm group-hover:scale-110 transition-transform">
                <Zap size={16} className="text-black" fill="currentColor" />
              </div>
              <span className="font-display font-800 text-xl tracking-tight">
                <span className="text-[var(--primary)]">NE</span>
                <span className="text-[var(--foreground)]">World</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((link) => (
                <div key={link.page} className="relative">
                  <button
                    onClick={() => {
                      if (link.hasDropdown) {
                        setCategoryOpen(!categoryOpen);
                      } else {
                        onNavigate(link.page);
                        setCategoryOpen(false);
                      }
                    }}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-all duration-200"
                  >
                    {link.label}
                    {link.hasDropdown && (
                      <ChevronDown size={14} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {link.hasDropdown && (
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-2 w-56 glass-strong rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-[var(--border)]"
                        >
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                onNavigate("category", { slug: cat.toLowerCase().replace(/ /g, "-") });
                                setCategoryOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className={`hidden md:flex flex-1 max-w-xl mx-4 relative transition-all duration-300 ${searchFocused ? "max-w-2xl" : ""}`}>
              <div className={`flex items-center w-full rounded-xl border transition-all duration-200 ${
                searchFocused
                  ? "border-[var(--primary)] shadow-[0_0_0_3px_rgba(0,212,255,0.15)]"
                  : "border-[var(--border)]"
              } bg-[var(--muted)]`}>
                <Search size={16} className="ml-3 shrink-0 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search mobile accessories, screen protectors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full px-3 py-2.5 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="mr-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-all duration-200"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => onNavigate("wishlist")}
                className="relative p-2.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:bg-[var(--border)] transition-all duration-200"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-white text-[10px] flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={onCartOpen}
                className="relative p-2.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--border)] transition-all duration-200"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--primary)] text-black text-[10px] flex items-center justify-center font-mono font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={() => onNavigate("account")}
                className="hidden md:flex items-center gap-2 pl-3 pr-4 py-2 ml-1 rounded-xl glass border border-[var(--border)] text-sm text-[var(--foreground)] hover:border-[var(--primary)] transition-all duration-200"
              >
                <User size={16} />
                <span className="font-medium">Account</span>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-[var(--muted-foreground)] hover:bg-[var(--border)] transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3 px-1">
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--muted)]">
              <Search size={16} className="ml-3 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden glass-strong border-t border-[var(--border)]"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-[var(--foreground)] hover:bg-[var(--border)] transition-colors font-medium"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop for dropdown */}
      {categoryOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setCategoryOpen(false)} />
      )}
    </>
  );
}
