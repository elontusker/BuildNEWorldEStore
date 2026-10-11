import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X, ChevronDown } from "lucide-react";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

interface ProductListingProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  categorySlug?: string;
  searchQuery?: string;
}

export default function ProductListing({ onNavigate, categorySlug, searchQuery }: ProductListingProps) {
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : null;
  const brands = [...new Set(products.map((p) => p.brand))];

  const filtered = useMemo(() => {
    let list = [...products];
    if (categorySlug) list = list.filter((p) => p.category === categorySlug || p.subcategory.toLowerCase().includes(categorySlug));
    if (searchQuery) list = list.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (selectedRating) list = list.filter((p) => (p.rating ?? 0) >= selectedRating);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-asc": return list.sort((a, b) => a.price - b.price);
      case "price-desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "newest": return list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
      default: return list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    }
  }, [categorySlug, searchQuery, selectedBrands, selectedRating, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((b) => b.includes(brand) ? b.filter((x) => x !== brand) : [...b, brand]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Page header */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-mono text-[var(--primary)] uppercase tracking-widest mb-2">
              {searchQuery ? "Search Results" : category ? "Category" : "All Products"}
            </p>
            <h1 className="font-display font-800 text-4xl text-[var(--foreground)]">
              {searchQuery ? `"${searchQuery}"` : category ? category.name : "All Products"}
            </h1>
            <p className="text-[var(--muted-foreground)] mt-2 text-sm">{filtered.length} products found</p>
          </motion.div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="glass rounded-2xl border border-[var(--border)] p-6 space-y-8 sticky top-28">
              {/* Sort */}
              <div>
                <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4 uppercase tracking-widest">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "popular", label: "Most Popular" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "newest", label: "Newest First" },
                    { value: "price-asc", label: "Price: Low → High" },
                    { value: "price-desc", label: "Price: High → Low" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        sortBy === opt.value
                          ? "bg-[var(--primary)]/15 text-[var(--primary)] font-600"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4 uppercase tracking-widest">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    placeholder="₹ Min"
                  />
                  <span className="text-[var(--muted-foreground)]">–</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)]"
                    placeholder="₹ Max"
                  />
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4 uppercase tracking-widest">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          selectedBrands.includes(brand)
                            ? "border-[var(--primary)] bg-[var(--primary)]"
                            : "border-[var(--border)] group-hover:border-[var(--primary)]/50"
                        }`}
                      >
                        {selectedBrands.includes(brand) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L4 7L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-display font-700 text-sm text-[var(--foreground)] mb-4 uppercase tracking-widest">Min Rating</h3>
                <div className="flex gap-2">
                  {[4, 4.5, 4.8].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRating(selectedRating === r ? 0 : r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        selectedRating === r
                          ? "bg-yellow-500 text-black font-700"
                          : "glass border border-[var(--border)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {r}★+
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {(selectedBrands.length > 0 || selectedRating > 0) && (
                <button
                  onClick={() => { setSelectedBrands([]); setSelectedRating(0); }}
                  className="flex items-center gap-2 text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-[var(--border)] text-sm text-[var(--foreground)]"
              >
                <SlidersHorizontal size={16} />
                Filters
                {(selectedBrands.length > 0 || selectedRating > 0) && (
                  <span className="w-4 h-4 rounded-full bg-[var(--primary)] text-black text-[10px] flex items-center justify-center font-bold">
                    {selectedBrands.length + (selectedRating ? 1 : 0)}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {[
                  { cols: 4, Icon: Grid3X3 },
                  { cols: 2, Icon: List },
                ].map(({ cols, Icon }) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`p-2.5 rounded-xl transition-all ${
                      gridCols === cols
                        ? "bg-[var(--primary)] text-black"
                        : "glass border border-[var(--border)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display font-700 text-xl text-[var(--foreground)] mb-2">No products found</p>
                <p className="text-[var(--muted-foreground)] text-sm">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${gridCols === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
