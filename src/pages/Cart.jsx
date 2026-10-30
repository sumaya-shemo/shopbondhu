import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Heart,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import {
  FREE_SHIPPING_THRESHOLD,
  formatBDT,
  standardShipping,
} from "../lib/format";
import QuantityStepper from "../components/QuantityStepper";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";

export default function Cart() {
  const {
    cartLines,
    cartCount,
    subtotal,
    discount,
    coupon,
    updateQty,
    removeItem,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    recommendations,
  } = useStore();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  const shipping = standardShipping(subtotal);
  const total = subtotal - discount + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCoupon = (event) => {
    event.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      setCode("");
      setCouponError("");
    } else {
      setCouponError(result.message);
    }
  };

  const moveToWishlist = (line) => {
    if (!line.product) return;
    toggleWishlist(line.id);
    removeItem(line.key);
  };

  if (cartLines.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Cart</span>
          </nav>
          <div className="cart-empty">
            <span className="cart-empty__icon">
              <ShoppingBag size={34} />
            </span>
            <span className="eyebrow">Nothing here yet</span>
            <h1>Your cart is feeling a little light.</h1>
            <p>
              Let's find something good. Explore the shop, or start with the things people love most.
            </p>
            <div className="cart-empty__actions">
              <Link className="btn btn--primary" to="/shop">
                Start shopping <ArrowRight size={16} />
              </Link>
              <Link className="btn btn--ghost" to="/shop?filter=bestsellers">
                Shop bestsellers
              </Link>
            </div>
            <div className="cart-empty__perks">
              <span>
                <Truck size={16} /> Free delivery over {formatBDT(FREE_SHIPPING_THRESHOLD)}
              </span>
              <span>
                <RotateCcw size={16} /> 7-day easy returns
              </span>
              <span>
                <ShieldCheck size={16} /> 100% authentic
              </span>
            </div>
          </div>

          <section className="section cart-recommend">
            <SectionHeading
              eyebrow="A little inspiration"
              title="Popular right now"
              link="/shop"
              linkLabel="Browse all"
            />
            <div className="product-grid product-grid--4">
              {recommendations.map((product, index) => (
                <Reveal key={product.id} delay={index * 50}>
                  <ProductCard product={product} index={index} />
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Cart</span>
        </nav>

        <header className="page-head">
          <div>
            <span className="eyebrow">
              <ShoppingBag size={14} /> Your bag
            </span>
            <h1>Your cart ({cartCount})</h1>
            <p>Not in a rush? We'll keep these safe until you're ready.</p>
          </div>
          <Link className="text-link" to="/shop">
            Continue shopping <ArrowRight size={16} />
          </Link>
        </header>

        <div className="cart-layout">
          <div className="cart-main">
            <div className="cart-shipping">
              <div>
                {remaining > 0 ? (
                  <p>
                    <Truck size={17} /> Add <strong>{formatBDT(remaining)}</strong> more for free
                    delivery.
                  </p>
                ) : (
                  <p>
                    <BadgeCheck size={17} /> You've unlocked free delivery. Nice one.
                  </p>
                )}
                <div className="progress">
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="cart-lines">
              <div className="cart-lines__head">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>
              {cartLines.map((line) => (
                <div className="cart-line" key={line.key}>
                  <Link to={`/product/${line.product.slug}`} className="cart-line__image">
                    <img src={line.product.images[0]} alt={line.product.name} />
                  </Link>
                  <div className="cart-line__copy">
                    <span className="cart-line__cat">{line.product.category}</span>
                    <Link to={`/product/${line.product.slug}`}>{line.product.name}</Link>
                    <span className="cart-line__options">
                      {[line.options.color, line.options.size && `Size ${line.options.size}`]
                        .filter(Boolean)
                        .join(" · ") || "Standard"}
                    </span>
                    <span className="cart-line__stock">
                      <span className={`dot dot--${line.product.stock > 5 ? "in" : "low"}`} />
                      {line.product.stock > 5 ? "In stock" : `Only ${line.product.stock} left`}
                    </span>
                    <div className="cart-line__mobile-row">
                      <QuantityStepper
                        value={line.qty}
                        onChange={(qty) => updateQty(line.key, qty)}
                        max={line.product.stock}
                        small
                      />
                      <strong>{formatBDT(line.lineTotal)}</strong>
                    </div>
                    <div className="cart-line__actions">
                      <button type="button" onClick={() => moveToWishlist(line)}>
                        <Heart size={14} /> Save for later
                      </button>
                      <button type="button" onClick={() => removeItem(line.key)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-line__qty">
                    <QuantityStepper
                      value={line.qty}
                      onChange={(qty) => updateQty(line.key, qty)}
                      max={line.product.stock}
                    />
                  </div>
                  <div className="cart-line__total">
                    <strong>{formatBDT(line.lineTotal)}</strong>
                    <small>{formatBDT(line.product.price)} each</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-extras">
              <div className="coupon-box">
                <span className="coupon-box__label">
                  <Tag size={16} /> Have a coupon?
                </span>
                {coupon ? (
                  <div className="coupon-applied">
                    <span>
                      <BadgeCheck size={17} /> <strong>{coupon.code}</strong> — {coupon.label}
                    </span>
                    <button type="button" onClick={removeCoupon} aria-label="Remove coupon">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCoupon}>
                    <input
                      type="text"
                      placeholder="Enter code e.g. BONDHU10"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value);
                        setCouponError("");
                      }}
                      aria-label="Coupon code"
                    />
                    <button type="submit" className="btn btn--ghost btn--sm">
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="form-error" role="alert">
                    {couponError}
                  </p>
                )}
                {!coupon && (
                  <p className="coupon-box__hint">
                    Try <button type="button" onClick={() => setCode("BONDHU10")}>BONDHU10</button> for
                    10% off, or <button type="button" onClick={() => setCode("NEW200")}>NEW200</button>{" "}
                    for ৳200 off orders over ৳2,000.
                  </p>
                )}
              </div>

              <div className="cart-gift">
                <Sparkles size={18} />
                <div>
                  <strong>Is this a gift?</strong>
                  <p>Add a handwritten note at checkout — we'll wrap it in recycled paper, free.</p>
                </div>
              </div>
            </div>

            <div className="cart-assurance">
              <span>
                <ShieldCheck size={18} /> Secure checkout
              </span>
              <span>
                <RotateCcw size={18} /> 7-day returns
              </span>
              <span>
                <Truck size={18} /> Tracked delivery
              </span>
              <span>
                <LockKeyhole size={18} /> Encrypted payments
              </span>
            </div>
          </div>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <strong>{formatBDT(subtotal)}</strong>
            </div>
            {discount > 0 && (
              <div className="summary-row summary-row--discount">
                <span>Discount ({coupon.code})</span>
                <strong>−{formatBDT(discount)}</strong>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery</span>
              <strong>{shipping === 0 ? "Free" : formatBDT(shipping)}</strong>
            </div>
            <div className="summary-row summary-row--muted">
              <span>Taxes</span>
              <span>Included</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{formatBDT(total)}</strong>
            </div>
            <p className="summary-note">
              {remaining > 0
                ? `Add ${formatBDT(remaining)} more for free delivery.`
                : "Free delivery applied. You're all set."}
            </p>
            <button type="button" className="btn btn--primary btn--full" onClick={() => navigate("/checkout")}>
              <LockKeyhole size={16} /> Proceed to checkout
            </button>
            <div className="summary-payments">
              <span>We accept</span>
              <div>
                <span>bKash</span>
                <span>Nagad</span>
                <span>VISA</span>
                <span>Mastercard</span>
              </div>
            </div>
            <div className="summary-help">
              <p>
                <strong>Need help with your order?</strong>
              </p>
              <a href="tel:+8809612345678">Call +880 9612 345 678</a>
              <span>Every day, 9am–9pm</span>
            </div>
          </aside>
        </div>

        <section className="section cart-recommend">
          <SectionHeading
            eyebrow="Before you go"
            title="People also add"
            copy="Small additions that make the everyday a little nicer."
            link="/shop"
            linkLabel="Browse all"
          />
          <div className="product-grid product-grid--4">
            {recommendations.map((product, index) => (
              <Reveal key={product.id} delay={index * 50}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
