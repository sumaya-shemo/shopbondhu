import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Headphones,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatBDT, orderTimeline } from "../lib/format";
import { productById } from "../data/products";

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders, addToast } = useStore();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <div className="container section">
        <div className="cart-empty">
          <span className="cart-empty__icon">
            <Package size={32} />
          </span>
          <h1>We couldn't find that order.</h1>
          <p>Double-check the order number, or get in touch and we'll help you find it.</p>
          <div className="cart-empty__actions">
            <Link className="btn btn--primary" to="/track">
              Track an order <ArrowRight size={16} />
            </Link>
            <Link className="btn btn--ghost" to="/support">
              Contact support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const timeline = orderTimeline(order);
  const etaDate = new Date(order.date);
  etaDate.setDate(etaDate.getDate() + (order.address.city === "Dhaka" ? 2 : 4));
  const eta = etaDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      addToast("Order number copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Copy failed — you can select the number manually.", "error");
    }
  };

  return (
    <div className="order-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/account">Orders</Link>
          <ChevronRight size={13} />
          <span>{order.id}</span>
        </nav>

        <div className="order-success">
          <div className="order-success__badge" aria-hidden="true">
            <span className="order-success__ring" />
            <Check size={34} />
          </div>
          <span className="eyebrow">
            <BadgeCheck size={14} /> Payment confirmed
          </span>
          <h1>
            {location.state?.justPlaced ? "Thank you" : "Your order"},{" "}
            {(order.customer || "friend").split(" ")[0]}!
          </h1>
          <p>
            Your order is in good hands. We've sent a confirmation to{" "}
            <strong>{order.email || order.address.email}</strong> with everything you need.
          </p>
          <div className="order-number">
            <span>Order number</span>
            <strong>{order.id}</strong>
            <button type="button" onClick={copyId} aria-label="Copy order number">
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <div className="order-success__actions">
            <Link
              className="btn btn--primary"
              to={`/track?order=${order.id}&phone=${order.phone}`}
            >
              <Truck size={17} /> Track my order
            </Link>
            <Link className="btn btn--ghost" to="/shop">
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="order-layout">
          <div className="order-main">
            <section className="order-card">
              <div className="order-card__head">
                <div>
                  <span className="eyebrow">Live progress</span>
                  <h2>On its way to you</h2>
                </div>
                <span className="status-pill">{order.status}</span>
              </div>
              <div className="timeline">
                {timeline.map((step, index) => (
                  <div
                    className={`timeline__step ${step.done ? "is-done" : ""} ${step.current ? "is-current" : ""}`}
                    key={step.label}
                  >
                    <span className="timeline__dot">
                      {step.done ? <Check size={13} /> : <span />}
                    </span>
                    <div>
                      <strong>{step.label}</strong>
                      <small>{step.date ?? "Coming up"}</small>
                    </div>
                    {index < timeline.length - 1 && <span className="timeline__line" />}
                  </div>
                ))}
              </div>
              <div className="order-eta">
                <span className="order-eta__icon">
                  <Truck size={21} />
                </span>
                <div>
                  <strong>Estimated delivery: {eta}</strong>
                  <p>
                    {order.delivery} to {order.address.area}, {order.address.city}. We'll send an SMS
                    when it's out for delivery.
                  </p>
                </div>
              </div>
            </section>

            <section className="order-card">
              <div className="order-card__head">
                <h2>Your items</h2>
                <span>{order.items.reduce((sum, item) => sum + item.qty, 0)} items</span>
              </div>
              <div className="order-items">
                {order.items.map((item) => {
                  const product = productById(item.id);
                  const productLink = product ? `/product/${product.slug}` : "/shop";
                  return (
                    <div className="order-item" key={`${item.id}-${item.qty}`}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <Link to={productLink}>{item.name}</Link>
                        <small>
                          {[item.options?.color, item.options?.size && `Size ${item.options.size}`]
                            .filter(Boolean)
                            .join(" · ") || "Standard"}{" "}
                          · Qty {item.qty}
                        </small>
                      </div>
                      <strong>{formatBDT(item.price * item.qty)}</strong>
                    </div>
                  );
                })}
              </div>
              <div className="order-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatBDT(order.totals.subtotal)}</strong>
                </div>
                {order.totals.discount > 0 && (
                  <div>
                    <span>Discount</span>
                    <strong>−{formatBDT(order.totals.discount)}</strong>
                  </div>
                )}
                <div>
                  <span>Delivery</span>
                  <strong>{order.totals.shipping === 0 ? "Free" : formatBDT(order.totals.shipping)}</strong>
                </div>
                <div className="order-totals__total">
                  <span>Total paid</span>
                  <strong>{formatBDT(order.totals.total)}</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="order-side">
            <div className="order-card order-card--side">
              <h3>Delivery address</h3>
              <p>
                <strong>{order.address.name}</strong>
                <br />
                {order.address.apartment && `${order.address.apartment}, `}
                {order.address.street}
                <br />
                {order.address.area}, {order.address.city}
                {order.address.postcode ? ` ${order.address.postcode}` : ""}
                <br />
                {order.phone}
              </p>
              {order.address.notes && <p className="order-note">“{order.address.notes}”</p>}
            </div>
            <div className="order-card order-card--side">
              <h3>Payment</h3>
              <p className="order-payment">
                <CreditCard size={18} />
                <span>
                  <strong>{order.payment}</strong>
                  <small>Total {formatBDT(order.totals.total)}</small>
                </span>
              </p>
              <p className="order-payment">
                <MapPin size={18} />
                <span>
                  <strong>{order.delivery}</strong>
                  <small>Tracking: {order.trackingCode}</small>
                </span>
              </p>
            </div>
            <div className="order-card order-card--side order-support">
              <Headphones size={22} />
              <h3>We're here if you need us</h3>
              <p>Questions about your order? A real human is a message away.</p>
              <Link className="text-link" to="/support">
                Get in touch <ArrowRight size={15} />
              </Link>
            </div>
          </aside>
        </div>

        <div className="order-foot">
          <ShoppingBag size={18} />
          <span>While you wait, have a look at what's new in the shop.</span>
          <Link className="text-link" to="/shop?filter=new">
            Shop new arrivals <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
