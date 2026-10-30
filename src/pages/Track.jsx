import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Headphones,
  MapPin,
  PackageSearch,
  Search,
  Truck,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatBDT, orderTimeline } from "../lib/format";

export default function Track() {
  const { orders } = useStore();
  const [params, setParams] = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("order") || "");
  const [phone, setPhone] = useState(params.get("phone") || "");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const id = params.get("order");
    const number = params.get("phone");
    if (!id) return;
    const found = orders.find(
      (order) =>
        order.id.toLowerCase() === id.trim().toLowerCase() &&
        (!number || order.phone.replace(/\s/g, "") === number.replace(/\s/g, ""))
    );
    if (found) setResult(found);
  }, [params, orders]);

  const lookup = (event) => {
    event.preventDefault();
    const id = orderId.trim().toUpperCase();
    const number = phone.replace(/\s/g, "");
    if (!id) {
      setError("Please enter your order number.");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(number)) {
      setError("Enter the 11-digit mobile number you ordered with.");
      return;
    }
    const found = orders.find(
      (order) => order.id.toUpperCase() === id && order.phone.replace(/\s/g, "") === number
    );
    if (!found) {
      setError(
        "We couldn't find an order with those details. Check the number and try again, or contact us and we'll help."
      );
      setResult(null);
      return;
    }
    setError("");
    setResult(found);
    setParams({ order: found.id, phone: number });
  };

  const loadDemo = () => {
    setOrderId("SB-2026-1042");
    setPhone("01712345678");
    setError("");
    const found = orders.find((order) => order.id === "SB-2026-1042");
    if (found) {
      setResult(found);
      setParams({ order: found.id, phone: found.phone });
    }
  };

  const reset = () => {
    setOrderId("");
    setPhone("");
    setError("");
    setResult(null);
    setParams({});
  };

  const timeline = result ? orderTimeline(result) : [];

  return (
    <div className="track-page">
      <section className="track-hero">
        <div className="container track-hero__inner">
          <div>
            <span className="eyebrow">
              <PackageSearch size={14} /> Order tracking
            </span>
            <h1>Where's my good stuff?</h1>
            <p>
              Pop in your order number and phone number — no account needed. We'll show you exactly
              where your parcel is.
            </p>
          </div>
          <div className="track-hero__art" aria-hidden="true">
            <span className="track-hero__box">
              <PackageSearch size={40} />
            </span>
            <span className="track-hero__path" />
            <span className="track-hero__dot" />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="track-layout">
          <div className="track-main">
            <form className="track-form" onSubmit={lookup} noValidate>
              <div className="track-form__head">
                <h2>Find your order</h2>
                <span>Both details are on your confirmation SMS or email.</span>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span className="field__label">Order number</span>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(event) => {
                      setOrderId(event.target.value);
                      setError("");
                    }}
                    placeholder="e.g. SB-2026-1042"
                    autoComplete="off"
                  />
                </label>
                <label className="field">
                  <span className="field__label">Phone number</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setError("");
                    }}
                    placeholder="01712 345678"
                    autoComplete="tel"
                  />
                </label>
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <div className="track-form__actions">
                <button type="submit" className="btn btn--primary">
                  <Search size={17} /> Track my order
                </button>
                <button type="button" className="text-button" onClick={loadDemo}>
                  Try a sample order
                </button>
              </div>
              <p className="track-form__help">
                <CircleHelp size={15} /> Can't find your order number?{" "}
                <Link to="/support">We can help.</Link>
              </p>
            </form>

            {result && (
              <div className="track-result">
                <div className="track-result__head">
                  <div>
                    <span className="eyebrow">Order {result.id}</span>
                    <h2>Good news — it's {result.status.toLowerCase()}.</h2>
                    <p>
                      Placed on{" "}
                      {new Date(result.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {result.items.reduce((sum, item) => sum + item.qty, 0)} items ·{" "}
                      {formatBDT(result.totals.total)}
                    </p>
                  </div>
                  <span className="status-pill status-pill--lg">{result.status}</span>
                </div>

                <div className="track-progress">
                  {timeline.map((step, index) => (
                    <div
                      key={step.label}
                      className={`track-progress__step ${step.done ? "is-done" : ""} ${step.current ? "is-current" : ""}`}
                    >
                      <span className="track-progress__dot">
                        {step.done ? <Check size={14} /> : index + 1}
                      </span>
                      <strong>{step.label}</strong>
                      <small>{step.date ?? "Pending"}</small>
                      {index < timeline.length - 1 && <span className="track-progress__line" />}
                    </div>
                  ))}
                </div>

                <div className="track-result__grid">
                  <div className="track-info">
                    <span className="track-info__icon">
                      <Truck size={19} />
                    </span>
                    <div>
                      <strong>{result.delivery}</strong>
                      <p>Tracking code: {result.trackingCode}</p>
                      <small>
                        {result.status === "Delivered"
                          ? "Delivered — we hope you love it."
                          : "We'll SMS you when it's out for delivery."}
                      </small>
                    </div>
                  </div>
                  <div className="track-info">
                    <span className="track-info__icon">
                      <MapPin size={19} />
                    </span>
                    <div>
                      <strong>Delivering to {result.address.area}</strong>
                      <p>
                        {result.address.street}, {result.address.city}
                      </p>
                      <small>{result.address.name} · {result.phone}</small>
                    </div>
                  </div>
                </div>

                <div className="track-items">
                  {result.items.map((item) => (
                    <div key={`${item.id}-${item.qty}`} className="track-item">
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                      <small>Qty {item.qty}</small>
                    </div>
                  ))}
                </div>

                <div className="track-result__foot">
                  <button type="button" className="text-button" onClick={reset}>
                    Track another order
                  </button>
                  <Link className="btn btn--ghost btn--sm" to="/support">
                    <Headphones size={15} /> Need help with this order?
                  </Link>
                </div>
              </div>
            )}
          </div>

          <aside className="track-side">
            <div className="track-side__card track-side__card--demo">
              <span className="eyebrow">Just exploring?</span>
              <h3>Try the demo order</h3>
              <p>Use these details to see what tracking looks like after a real purchase.</p>
              <div className="demo-credentials">
                <span>
                  Order <strong>SB-2026-1042</strong>
                </span>
                <span>
                  Phone <strong>01712345678</strong>
                </span>
              </div>
              <button type="button" className="btn btn--accent btn--full" onClick={loadDemo}>
                Load sample order <ArrowRight size={16} />
              </button>
            </div>

            <div className="track-side__card">
              <h3>What do the statuses mean?</h3>
              <ul className="status-legend">
                <li>
                  <span className="status-dot status-dot--placed" />
                  <span>
                    <strong>Placed</strong>
                    <small>We've got your order and payment.</small>
                  </span>
                </li>
                <li>
                  <span className="status-dot status-dot--packed" />
                  <span>
                    <strong>Packed</strong>
                    <small>Checked, wrapped and ready to leave.</small>
                  </span>
                </li>
                <li>
                  <span className="status-dot status-dot--shipped" />
                  <span>
                    <strong>Shipped</strong>
                    <small>Handed to our delivery partner.</small>
                  </span>
                </li>
                <li>
                  <span className="status-dot status-dot--delivered" />
                  <span>
                    <strong>Delivered</strong>
                    <small>At your door — enjoy!</small>
                  </span>
                </li>
              </ul>
            </div>

            <div className="track-side__card track-side__card--help">
              <Headphones size={22} />
              <h3>Stuck? We're human.</h3>
              <p>Call or message us every day between 9am and 9pm.</p>
              <a href="tel:+8809612345678">+880 9612 345 678</a>
              <Link className="text-link" to="/support">
                Visit support <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>

        <div className="track-note">
          <Clock3 size={18} />
          <span>Orders are usually scanned by our courier within 24 hours of dispatch.</span>
          <Link className="text-link" to="/support#delivery">
            Delivery info <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
