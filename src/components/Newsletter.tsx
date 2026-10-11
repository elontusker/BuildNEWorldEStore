import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="py-24 px-4 lg:px-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/20 via-[var(--muted)] to-[var(--primary)]/10" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.12) 0%, transparent 50%),
                              radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.12) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 border border-[var(--border)] rounded-3xl" />

        <div className="relative px-8 md:px-16 py-16 md:py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center">
                <Mail size={18} className="text-black" />
              </div>
              <p className="text-xs font-mono text-[var(--primary)] tracking-[0.2em] uppercase">Stay Updated</p>
            </div>
            <h2 className="font-display font-800 text-3xl lg:text-4xl text-[var(--foreground)] mb-4">
              Get Exclusive Deals<br />
              <span className="gradient-text-cyan">Before Anyone Else</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-sm leading-relaxed">
              Subscribe for flash sale alerts, new arrivals, and members-only discount codes straight to your inbox.
            </p>

            {/* Perks */}
            <div className="flex gap-6 mt-6">
              {["10% off first order", "Flash sale alerts", "New arrival drops"].map((perk) => (
                <div key={perk} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[var(--primary)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 w-full max-w-md">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center glass-strong rounded-2xl p-8 border border-[var(--primary)]/30"
              >
                <CheckCircle size={48} className="text-[var(--primary)] mx-auto mb-4" />
                <h3 className="font-display font-700 text-xl text-[var(--foreground)] mb-2">You're subscribed!</h3>
                <p className="text-[var(--muted-foreground)] text-sm">Check your inbox for your 10% welcome discount code.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 border border-[var(--border)]">
                <div className="mb-4">
                  <label className="text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-widest block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.15)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] text-sm outline-none transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-black font-display font-700 text-sm glow-cyan-sm transition-all"
                >
                  Subscribe & Get 10% Off
                  <ArrowRight size={16} />
                </motion.button>
                <p className="text-[10px] text-center text-[var(--muted-foreground)] mt-4">
                  No spam ever. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
