import { Zap, MapPin, Phone, Mail, Share2, MessageCircle, PlayCircle, Bookmark } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const links = {
    "Shop": ["Tempered Glass", "Hydrogel Film", "Watch Protectors", "Phone Cases", "Accessories", "Custom Cut Films"],
    "Brands": ["Apple", "Samsung", "OnePlus", "Google Pixel", "Nothing Phone", "Vivo & Oppo"],
    "Customer": ["Track Order", "Returns & Exchange", "Warranty Policy", "Installation Guide", "Contact Support", "FAQ"],
    "Company": ["About NEWorld", "Careers", "Press Kit", "Bulk Orders", "Affiliate Program", "Privacy Policy"],
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <button onClick={() => onNavigate("home")} className="flex items-center gap-2 mb-5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Zap size={16} className="text-black" fill="currentColor" />
              </div>
              <span className="font-display font-800 text-xl">
                <span className="text-[var(--primary)]">NE</span>
                <span className="text-[var(--foreground)]">World</span>
                <span className="text-[var(--muted-foreground)] font-400 text-sm ml-1">eStore</span>
              </span>
            </button>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 max-w-xs">
              India's most trusted mobile accessories store. Protecting your devices since 2018.
            </p>

            {/* Socials */}
            <div className="flex gap-3 mb-8">
              {[Share2, MessageCircle, PlayCircle, Bookmark].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl glass border border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-3">
              {[
                { Icon: MapPin, text: "Mumbai, Maharashtra, India" },
                { Icon: Phone, text: "+91 98765 43210" },
                { Icon: Mail, text: "support@neworld.in" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={14} className="text-[var(--primary)] mt-0.5 shrink-0" />
                  <span className="text-xs text-[var(--muted-foreground)]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="font-display font-700 text-sm text-[var(--foreground)] mb-5 uppercase tracking-widest">{heading}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            © 2026 NEWorld eStore Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                {item}
              </a>
            ))}
          </div>
          {/* Payment logos */}
          <div className="flex items-center gap-2">
            {["Razorpay", "Stripe", "UPI", "COD"].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-md glass border border-[var(--border)] text-[9px] font-mono text-[var(--muted-foreground)] uppercase">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
