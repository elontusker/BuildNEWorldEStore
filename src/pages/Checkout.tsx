import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Truck, ChevronRight, Zap } from "lucide-react";
import { cartStore } from "../store/cartStore";

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", pin: "", state: "" });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [ordered, setOrdered] = useState(false);

  const items = cartStore.getCart();
  const total = cartStore.getCartTotal();
  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handlePlaceOrder = () => {
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-24 h-24 rounded-full bg-[var(--primary)]/15 border-2 border-[var(--primary)] flex items-center justify-center mx-auto mb-8 glow-cyan">
            <ShieldCheck size={40} className="text-[var(--primary)]" />
          </div>
          <h1 className="font-display font-800 text-3xl text-[var(--foreground)] mb-3">Order Placed! 🎉</h1>
          <p className="text-[var(--muted-foreground)] mb-2">Your order <span className="font-mono text-[var(--primary)]">#NW{Date.now().toString().slice(-6)}</span> has been confirmed.</p>
          <p className="text-[var(--muted-foreground)] text-sm mb-8">Estimated delivery in 2-5 business days. You'll receive a tracking link via email and SMS.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate("account")}
              className="px-6 py-3 rounded-xl glass border border-[var(--border)] text-[var(--foreground)] font-display font-600 text-sm"
            >
              Track Order
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-black font-display font-700 text-sm glow-cyan-sm"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = ["Delivery", "Payment", "Review"];

  return (
    <div className="min-h-screen bg-[var(--background)] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <h1 className="font-display font-800 text-3xl text-[var(--foreground)] mb-10">Secure Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-600 text-sm transition-all ${
                  step === i + 1
                    ? "bg-[var(--primary)] text-black"
                    : step > i + 1
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === i + 1 ? "bg-black text-[var(--primary)]" : step > i + 1 ? "bg-[var(--primary)] text-black" : "bg-[var(--muted)]"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </span>
                {s}
              </button>
              {i < steps.length - 1 && <ChevronRight size={16} className="text-[var(--border)] mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="font-display font-700 text-lg text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <Truck size={18} className="text-[var(--primary)]" /> Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Rahul Sharma", col: "full" },
                    { key: "email", label: "Email", placeholder: "rahul@email.com" },
                    { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
                    { key: "address", label: "Address", placeholder: "123 MG Road, Flat 4B", col: "full" },
                    { key: "city", label: "City", placeholder: "Mumbai" },
                    { key: "state", label: "State", placeholder: "Maharashtra" },
                    { key: "pin", label: "PIN Code", placeholder: "400001" },
                  ].map(({ key, label, placeholder, col }) => (
                    <div key={key} className={col === "full" ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-widest mb-2">{label}</label>
                      <input
                        value={form[key as keyof typeof form]}
                        onChange={(e) => update(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full py-3.5 rounded-2xl bg-[var(--primary)] text-black font-display font-700 glow-cyan-sm"
                >
                  Continue to Payment →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="font-display font-700 text-lg text-[var(--foreground)] mb-6 flex items-center gap-2">
                  <CreditCard size={18} className="text-[var(--primary)]" /> Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { id: "razorpay", label: "Razorpay (UPI, Cards, Net Banking)", icon: "⚡" },
                    { id: "stripe", label: "Stripe (International Cards)", icon: "🌐" },
                    { id: "cod", label: "Cash on Delivery", icon: "💵" },
                  ].map((method) => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] glass"
                    }`}>
                      <input type="radio" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-[var(--primary)]" : "border-[var(--border)]"}`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
                      </div>
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-sm font-display font-600 text-[var(--foreground)]">{method.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl glass border border-[var(--border)] text-[var(--foreground)] font-display font-600">← Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] text-black font-display font-700 glow-cyan-sm">Review Order →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-2xl p-6 border border-[var(--border)]">
                <h2 className="font-display font-700 text-lg text-[var(--foreground)] mb-6">Order Summary</h2>
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-[var(--border)]">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover bg-[var(--muted)]" />
                    <div className="flex-1">
                      <p className="text-sm font-display font-600 text-[var(--foreground)] line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-display font-700 text-sm text-[var(--foreground)]">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-2xl glass border border-[var(--border)] text-[var(--foreground)] font-display font-600">← Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] text-black font-display font-800 glow-cyan flex items-center justify-center gap-2"
                  >
                    <Zap size={16} fill="currentColor" /> Place Order — ₹{finalTotal}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="glass rounded-2xl p-6 border border-[var(--border)] h-fit sticky top-28">
            <h3 className="font-display font-700 text-base text-[var(--foreground)] mb-5">Price Details</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-400 font-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="h-px bg-[var(--border)]" />
              <div className="flex justify-between font-display font-800 text-base text-[var(--foreground)]">
                <span>Total</span><span>₹{finalTotal}</span>
              </div>
            </div>
            <div className="glass rounded-xl p-3 border border-green-500/30 bg-green-500/5">
              <p className="text-xs text-green-400 font-display font-600">
                🎉 You're saving ₹{items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0)} on this order!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
