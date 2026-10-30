import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { FREE_SHIPPING_THRESHOLD, formatBDT, standardShipping } from "../lib/format";
import QuantityStepper from "./QuantityStepper";

export default function CartDrawer() {
  const {
    drawerOpen,
    setDrawerOpen,
    cartLines,
    cartCount,
    subtotal,
    discount,
    coupon,
    updateQty,
    removeItem,
    recommendations,
    addToCart,
  } = useStore();
  const closeRef = useRef(null);
  const shipping = standardShipping(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, setDrawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div className="drawer__backdrop" onClick={() => setDrawerOpen(false)} />
      <aside className="drawer__panel">
        <header className="drawer__head">
          <div>
            <span className="eyebrow">Your bag</span>
            <h2>
              Cart {cartCount > 0 && <span className="drawer__count">({cartCount})</span>}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close cart"
            ref={closeRef}
          >
            <X size={22} />
          </button>
        </header>

        {cartLines.length === 0 ? (
          <div className="drawer__empty">
            <span className="drawer__empty-icon">
              <ShoppingBag size={30} />
            </span>
            <h3>Your cart is taking a little nap.</h3>
            <p>Fill it with something lovely — we'll keep it safe here.</p>
            <Link className="btn btn--primary" to="/shop" onClick={() => setDrawerOpen(false)}>
              Start shopping <ArrowRight size={16} />
            </Link>
            <div className="drawer__empty-links">
              <Link to="/shop?filter=deals" onClick={() => setDrawerOpen(false)}>
                Browse today's deals
              </Link>
              <Link to="/wishlist" onClick={() => setDrawerOpen(false)}>
                View your wishlist
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="drawer__shipping">
              {remaining > 0 ? (
                <p>
                  You're <strong>{formatBDT(remaining)}</strong> away from free delivery.
                </p>
              ) : (
                <p>
                  <Truck size={14} /> You've unlocked free delivery — nice.
                </p>
              )}
              <div className="progress">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="drawer__lines">
              {cartLines.map((line) => (
                <div className="drawer-line" key={line.key}>
                  <Link to={`/product/${line.product.slug}`} onClick={() => setDrawerOpen(false)}>
                    <img src={line.product.images[0]} alt={line.product.name} />
                  </Link>
                  <div className="drawer-line__copy">
                    <Link to={`/product/${line.product.slug}`} onClick={() => setDrawerOpen(false)}>
                      {line.product.name}
                    </Link>
                    <span className="drawer-line__options">
                      {[line.options.color, line.options.size && `Size ${line.options.size}`]
                        .filter(Boolean)
                        .join(" · ") || line.product.category}
                    </span>
                    <div className="drawer-line__bottom">
                      <QuantityStepper
                        value={line.qty}
                        onChange={(qty) => updateQty(line.key, qty)}
                        max={line.product.stock}
                        small
                      />
                      <strong>{formatBDT(line.lineTotal)}</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="drawer-line__remove"
                    onClick={() => removeItem(line.key)}
                    aria-label={`Remove ${line.product.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="drawer__recommend">
              <span className="drawer__label">Pairs nicely with</span>
              <div className="drawer__recommend-row">
                {recommendations.slice(0, 2).map((product) => (
                  <button
                    type="button"
                    key={product.id}
                    className="mini-product"
                    onClick={() => addToCart(product)}
                  >
                    <img src={product.images[0]} alt="" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{formatBDT(product.price)} · Add</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <footer className="drawer__foot">
              <div className="drawer__row">
                <span>Subtotal</span>
                <strong>{formatBDT(subtotal)}</strong>
              </div>
              {discount > 0 && (
                <div className="drawer__row drawer__row--discount">
                  <span>{coupon?.code} discount</span>
                  <strong>−{formatBDT(discount)}</strong>
                </div>
              )}
              <div className="drawer__row">
                <span>Delivery</span>
                <strong>{shipping === 0 ? "Free" : formatBDT(shipping)}</strong>
              </div>
              <div className="drawer__row drawer__row--total">
                <span>Total</span>
                <strong>{formatBDT(subtotal - discount + shipping)}</strong>
              </div>
              <Link
                className="btn btn--primary btn--full"
                to="/checkout"
                onClick={() => setDrawerOpen(false)}
              >
                <LockKeyhole size={16} /> Checkout securely
              </Link>
              <Link className="btn btn--ghost btn--full" to="/cart" onClick={() => setDrawerOpen(false)}>
                View full cart
              </Link>
              <p className="drawer__note">
                <RotateCcw size={14} /> 7-day easy returns · <Truck size={14} /> Free over ৳1,500
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
