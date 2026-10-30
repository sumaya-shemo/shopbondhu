import { RotateCcw, ShieldCheck, Truck, Wallet } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Free delivery over ৳1,500",
    copy: "Fast, tracked delivery across Bangladesh.",
  },
  {
    icon: RotateCcw,
    title: "7-day easy returns",
    copy: "Changed your mind? We'll collect it, free.",
  },
  {
    icon: ShieldCheck,
    title: "100% authentic products",
    copy: "Sourced from brands and authorised partners.",
  },
  {
    icon: Wallet,
    title: "Pay your way",
    copy: "bKash, Nagad, cards or cash on delivery.",
  },
];

export default function TrustStrip({ compact = false }) {
  return (
    <section className={`trust-strip ${compact ? "trust-strip--compact" : ""}`} aria-label="Why shop with us">
      <div className="container trust-strip__grid">
        {items.map(({ icon: Icon, title, copy }) => (
          <div className="trust-item" key={title}>
            <span className="trust-item__icon">
              <Icon size={21} strokeWidth={1.8} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{copy}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
