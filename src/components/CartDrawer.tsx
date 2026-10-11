import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { cartStore } from "../store/cartStore";
import type { CartItem } from "../store/cartStore";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function CartDrawer({ open, onClose, onNavigate }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sync = () => {
      setItems([...cartStore.getCart()]);
      setTotal(cartStore.getCartTotal());
    };
    sync();
    return cartStore.subscribe(sync);
  }, []);

  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{ background: "var(--card)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} className="text-[var(--primary)]" />
                <h2 className="font-display font-700 text-lg text-[var(--foreground)]">Your Cart</h2>
                <span className="px-2 py-0.5 rounded-full bg-[var(--primary)] text-black text-xs font-mono font-bold">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl glass border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={56} className="text-[var(--muted-foreground)] opacity-30" />
                  <div>
                    <p className="font-display font-600 text-[var(--foreground)] mb-1">Your cart is empty</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Add products to get started</p>
                  </div>
                  <button
                    onClick={() => { onNavigate("products"); onClose(); }}
                    className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-display font-600 text-sm"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 glass rounded-2xl p-4 border border-[var(--border)]"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--muted)] shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase mb-0.5">{item.product.brand}</p>
                      <p className="font-display font-600 text-sm text-[var(--foreground)] line-clamp-2 mb-2 leading-snug">
                        {item.product.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg glass border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-sm w-4 text-center text-[var(--foreground)]">{item.quantity}</span>
                          <button
                            onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg glass border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-700 text-sm text-[var(--foreground)]">
                            ₹{item.product.price * item.quantity}
                          </span>
                          <button
                            onClick={() => cartStore.removeFromCart(item.product.id)}
                            className="text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-[var(--border)] space-y-4">
                {/* Free shipping bar */}
                {total < 499 && (
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-2">
                      Add <span className="text-[var(--primary)] font-700">₹{499 - total}</span> more for free shipping
                    </p>
                    <div className="h-1.5 rounded-full bg-[var(--muted)]">
                      <div
                        className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
                        style={{ width: `${(total / 499) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                    <span>Subtotal</span><span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400 font-600" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-display font-800 text-base text-[var(--foreground)] pt-2 border-t border-[var(--border)]">
                    <span>Total</span><span>₹{finalTotal}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onNavigate("checkout"); onClose(); }}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[var(--primary)] text-black font-display font-700 glow-cyan-sm"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
