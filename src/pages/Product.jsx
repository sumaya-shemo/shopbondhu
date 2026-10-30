import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Heart,
  Info,
  MapPin,
  Minus,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  Truck,
  Wallet,
  X,
  ZoomIn,
} from "lucide-react";
import { productBySlug, products, reviewPool } from "../data/products";
import { useStore } from "../store/StoreContext";
import {
  FREE_SHIPPING_THRESHOLD,
  discountPercent,
  formatBDT,
  standardShipping,
  stockLabel,
} from "../lib/format";
import RatingStars from "../components/RatingStars";
import Price from "../components/Price";
import QuantityStepper from "../components/QuantityStepper";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import TrustStrip from "../components/TrustStrip";
import NotFound from "./NotFound";

const cities = {
  Dhaka: { min: 1, max: 2, express: true },
  Chattogram: { min: 2, max: 3 },
  Sylhet: { min: 2, max: 4 },
  Khulna: { min: 2, max: 4 },
  Rajshahi: { min: 2, max: 4 },
  Barishal: { min: 3, max: 5 },
  Rangpur: { min: 3, max: 5 },
  Mymensingh: { min: 2, max: 4 },
};

const accordionData = [
  { key: "description", label: "Full description" },
  { key: "specs", label: "Specifications" },
  { key: "delivery", label: "Delivery & returns" },
  { key: "care", label: "Our care promise" },
];

export default function Product() {
  const { slug } = useParams();
  const product = productBySlug(slug);
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, markViewed, addToast } = useStore();

  const [imageIndex, setImageIndex] = useState(0);
  const [color, setColor] = useState(product?.colors?.[0]?.name ?? "");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Dhaka");
  const [openAccordion, setOpenAccordion] = useState("description");
  const [lightbox, setLightbox] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);
  const [reviewFilter, setReviewFilter] = useState(0);
  const addRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setImageIndex(0);
    setColor(product?.colors?.[0]?.name ?? "");
    setSize("");
    setQty(1);
    setError("");
    setOpenAccordion("description");
    setNotified(false);
    setNotifyEmail("");
    if (product) markViewed(product.id);
  }, [slug, product, markViewed]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event) => {
      if (event.key === "Escape") setLightbox(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const related = useMemo(() => {
    if (!product) return [];
    return [
      ...products.filter((item) => item.category === product.category && item.id !== product.id),
      ...products.filter((item) => item.category !== product.category && item.badge === "Bestseller"),
    ].slice(0, 4);
  }, [product]);

  if (!product) return <NotFound />;

  const saved = wishlist.includes(product.id);
  const stock = stockLabel(product.stock);
  const off = discountPercent(product.price, product.compareAt);
  const shipping = standardShipping(product.price);
  const reviews = reviewPool.slice(0, 3);
  const cityInfo = cities[city];
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + cityInfo.max);
  const deliveryLabel = deliveryDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const validate = () => {
    if (product.stock <= 0) {
      setError("This product is currently out of stock.");
      return false;
    }
    if (product.sizes?.length && !size) {
      setError("Please choose a size before adding to cart.");
      addRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    setError("");
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;
    addToCart(product, { qty, color, size });
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    const added = addToCart(product, { qty, color, size, open: false });
    if (added) navigate("/checkout");
  };

  const handleNotify = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      setError("Enter a valid email so we can let you know.");
      return;
    }
    setError("");
    setNotified(true);
    addToast("You're on the list — we'll email you when it's back.");
  };

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/shop">Shop</Link>
          <ChevronRight size={13} />
          <Link to={`/shop?category=${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <ChevronRight size={13} />
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-gallery__thumbs" role="tablist" aria-label="Product images">
              {product.images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={imageIndex === index ? "is-active" : ""}
                  onClick={() => setImageIndex(index)}
                  role="tab"
                  aria-selected={imageIndex === index}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
            <div className="product-gallery__main">
              {product.badge && <span className="badge badge--light">{product.badge}</span>}
              <button
                type="button"
                className="product-gallery__zoom"
                onClick={() => setLightbox(true)}
                aria-label="Zoom product image"
              >
                <img src={product.images[imageIndex]} alt={product.name} width="880" height="1080" />
                <span className="product-gallery__zoom-hint">
                  <ZoomIn size={16} /> Click to zoom
                </span>
              </button>
              <button
                type="button"
                className={`icon-btn product-gallery__heart ${saved ? "is-active" : ""}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={saved}
              >
                <Heart size={20} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="product-gallery__dots" aria-hidden="true">
              {product.images.map((image, index) => (
                <span key={image} className={imageIndex === index ? "is-active" : ""} />
              ))}
            </div>
            <p className="product-gallery__note">
              <Sparkles size={14} /> Photos are of the actual product. Colours may vary slightly by
              screen.
            </p>
          </div>

          <div className="product-info" ref={addRef}>
            <span className="eyebrow">
              {product.category === "stationery" ? "Books & Stationery" : product.category}
              {product.sold > 500 && <span className="product-info__sold">· {product.sold}+ sold</span>}
            </span>
            <h1>{product.name}</h1>
            <div className="product-info__rating">
              <RatingStars rating={product.rating} size={16} showValue />
              <a href="#reviews">{product.reviewCount} verified reviews</a>
              <span className="product-info__sku">SKU {product.id.toUpperCase()}</span>
            </div>

            <p className="product-info__short">{product.short}</p>

            <div className="product-info__price">
              <Price price={product.price} compareAt={product.compareAt} size="lg" showSave />
              {off > 0 && <span className="product-info__off">You save {formatBDT(product.compareAt - product.price)}</span>}
              <span className="product-info__tax">Inclusive of all taxes</span>
            </div>

            <div className="product-info__highlights">
              {product.highlights.slice(0, 3).map((highlight) => (
                <span key={highlight}>
                  <Check size={15} /> {highlight}
                </span>
              ))}
            </div>

            {product.colors?.length > 0 && (
              <div className="option-group">
                <div className="option-group__head">
                  <span>Colour</span>
                  <strong>{color}</strong>
                </div>
                <div className="swatches">
                  {product.colors.map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      className={`swatch ${color === item.name ? "is-active" : ""}`}
                      style={{ "--swatch": item.hex }}
                      onClick={() => setColor(item.name)}
                      aria-label={item.name}
                      aria-pressed={color === item.name}
                      title={item.name}
                    >
                      {color === item.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="option-group">
                <div className="option-group__head">
                  <span>Size</span>
                  <strong>{size ? `Size ${size}` : "Choose a size"}</strong>
                </div>
                <div className="size-options">
                  {product.sizes.map((item) => (
                    <button
                      type="button"
                      key={item}
                      className={size === item ? "is-active" : ""}
                      onClick={() => {
                        setSize(item);
                        setError("");
                      }}
                      aria-pressed={size === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-info__stock">
              <span className={`stock-pill stock-pill--${stock.tone}`}>
                <span className="stock-pill__dot" /> {stock.tone === "low" ? stock.text : stock.text}
              </span>
              <span className="product-info__delivery">
                <Truck size={15} /> Arrives by <strong>{deliveryLabel}</strong> in {city}
              </span>
            </div>

            {error && (
              <p className="form-error" role="alert">
                <Info size={15} /> {error}
              </p>
            )}

            {product.stock > 0 ? (
              <div className="product-info__actions">
                <QuantityStepper value={qty} onChange={setQty} max={product.stock} />
                <button type="button" className="btn btn--primary btn--add" onClick={handleAdd}>
                  <ShoppingBag size={18} /> Add to cart
                </button>
                <button
                  type="button"
                  className={`btn btn--wish ${saved ? "is-active" : ""}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={19} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>
            ) : (
              <div className="notify-box">
                <div>
                  <strong>Sold out for now</strong>
                  <p>Leave your email and we'll let you know when it's back.</p>
                </div>
                {notified ? (
                  <p className="notify-box__done">
                    <BadgeCheck size={17} /> You're on the list.
                  </p>
                ) : (
                  <form onSubmit={handleNotify}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={notifyEmail}
                      onChange={(event) => setNotifyEmail(event.target.value)}
                      aria-label="Email for restock notification"
                    />
                    <button type="submit" className="btn btn--primary btn--sm">
                      Notify me
                    </button>
                  </form>
                )}
              </div>
            )}

            <button type="button" className="btn btn--quick-buy" onClick={handleBuyNow} disabled={product.stock <= 0}>
              <Wallet size={18} /> Buy now — pay with bKash, Nagad or card
            </button>

            <div className="product-info__delivery-check">
              <span className="product-info__delivery-check-head">
                <MapPin size={16} /> Check delivery to your area
              </span>
              <div className="product-info__delivery-row">
                <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Delivery city">
                  {Object.keys(cities).map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <span>
                  {formatBDT(shipping)} · {cityInfo.min}–{cityInfo.max} working days
                  {cityInfo.express ? " · express available" : ""}
                </span>
              </div>
              <p className="product-info__delivery-note">
                Free delivery on orders over {formatBDT(FREE_SHIPPING_THRESHOLD)}. Order before 12pm
                for same-day dispatch.
              </p>
            </div>

            <div className="offers-box">
              <span className="offers-box__label">
                <Sparkles size={15} /> Offers & perks
              </span>
              <ul>
                <li>
                  <strong>BONDHU10</strong> — 10% off your first order (up to ৳300).
                </li>
                <li>
                  <strong>Free delivery</strong> — automatically applied over ৳1,500.
                </li>
                <li>
                  <strong>7-day returns</strong> — changed your mind? We'll collect it.
                </li>
              </ul>
            </div>

            <div className="product-info__trust">
              <span>
                <ShieldCheck size={18} />
                <strong>100% authentic</strong>
                <small>Sourced from the brand</small>
              </span>
              <span>
                <RotateCcw size={18} />
                <strong>{product.returns}</strong>
                <small>Free pickup in Dhaka</small>
              </span>
              <span>
                <CreditCard size={18} />
                <strong>Secure payments</strong>
                <small>bKash · Nagad · cards</small>
              </span>
            </div>

            <div className="accordions">
              {accordionData.map((item) => (
                <div className={`accordion ${openAccordion === item.key ? "is-open" : ""}`} key={item.key}>
                  <button
                    type="button"
                    className="accordion__head"
                    onClick={() => setOpenAccordion(openAccordion === item.key ? "" : item.key)}
                    aria-expanded={openAccordion === item.key}
                  >
                    {item.label}
                    <ChevronDown size={18} />
                  </button>
                  <div className="accordion__body">
                    {item.key === "description" && (
                      <>
                        <p>{product.description}</p>
                        <ul className="check-list">
                          {product.highlights.map((highlight) => (
                            <li key={highlight}>
                              <Check size={15} /> {highlight}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {item.key === "specs" && (
                      <dl className="spec-list">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key}>
                            <dt>{key}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {item.key === "delivery" && (
                      <div className="accordion__copy">
                        <p>
                          <strong>Delivery.</strong> We dispatch within one working day. Dhaka Metro
                          arrives in 1–2 days, major cities in 2–4, and the rest of Bangladesh in 3–5
                          working days. You'll get an SMS with a tracking link.
                        </p>
                        <p>
                          <strong>Returns.</strong> {product.returns}. Request a return from your
                          account within 7 days of delivery. Items should be unused and in their
                          original packaging; beauty items must be unopened with seals intact. We
                          arrange a free pickup for eligible returns.
                        </p>
                      </div>
                    )}
                    {item.key === "care" && (
                      <div className="accordion__copy">
                        <p>
                          <strong>Checked twice before it ships.</strong> Every item is inspected for
                          quality, completeness and packaging by our Dhaka team. If something isn't
                          right, message us and a real person will make it right — usually within one
                          working day.
                        </p>
                        <p>
                          <strong>Warranty.</strong> {product.warranty}. Keep your order confirmation
                          handy; we can look up your purchase by phone number too.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TrustStrip compact />

      <section className="section product-reviews" id="reviews">
        <div className="container">
          <div className="product-reviews__layout">
            <div className="product-reviews__summary">
              <span className="eyebrow">Customer reviews</span>
              <h2>What shoppers think</h2>
              <div className="review-summary__score">
                <strong>{product.rating.toFixed(1)}</strong>
                <div>
                  <RatingStars rating={product.rating} size={18} />
                  <span>Based on {product.reviewCount} verified reviews</span>
                </div>
              </div>
              <div className="review-bars">
                {[
                  [5, 78],
                  [4, 16],
                  [3, 4],
                  [2, 1],
                  [1, 1],
                ].map(([stars, percent]) => (
                  <div className="review-bar" key={stars}>
                    <span>{stars}★</span>
                    <div>
                      <span style={{ width: `${percent}%` }} />
                    </div>
                    <small>{percent}%</small>
                  </div>
                ))}
              </div>
              <div className="review-summary__tags">
                {["Great quality", "As described", "Fast delivery", "Good value"].map((tag) => (
                  <span key={tag}>
                    <ThumbsUp size={13} /> {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setReviewFilter((value) => (value + 1) % 4);
                  addToast("Reviews sorted — verified purchases only.", "neutral");
                }}
              >
                <Star size={16} /> Write a review
              </button>
              <p className="review-summary__note">
                Only customers who bought this product can leave a review. We never edit or remove
                honest feedback.
              </p>
            </div>

            <div className="product-reviews__list">
              <div className="reviews-list-head">
                <span>{reviews.length} recent reviews</span>
                <span className="verified-pill">
                  <BadgeCheck size={14} /> Verified purchases
                </span>
              </div>
              {reviews.map((review) => (
                <article className="product-review" key={review.name}>
                  <div className="product-review__top">
                    <span className="product-review__avatar">{review.initials}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>
                        {review.location} · {review.date}
                      </small>
                    </div>
                    <RatingStars rating={review.rating} size={14} />
                  </div>
                  <h3>{review.title}</h3>
                  <p>{review.body}</p>
                  <span className="product-review__verified">
                    <Check size={13} /> Verified purchase
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section related-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Goes well together"
              title="You might also like"
              copy="Chosen from the same corner of the shop — or a bestseller our customers love."
              link={`/shop?category=${product.category}`}
              linkLabel="More in this category"
            />
          </Reveal>
          <div className="product-grid product-grid--4">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 60}>
                <ProductCard product={item} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="mobile-buybar">
        <div>
          <span>{formatBDT(product.price)}</span>
          {product.compareAt && <s>{formatBDT(product.compareAt)}</s>}
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          <ShoppingBag size={17} /> {product.stock > 0 ? "Add to cart" : "Sold out"}
        </button>
      </div>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} image`}>
          <button type="button" className="lightbox__close" onClick={() => setLightbox(false)} aria-label="Close image">
            <X size={24} />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={() => setImageIndex((imageIndex - 1 + product.images.length) % product.images.length)}
            aria-label="Previous image"
          >
            <ChevronRight size={26} style={{ transform: "rotate(180deg)" }} />
          </button>
          <img src={product.images[imageIndex]} alt={product.name} />
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={() => setImageIndex((imageIndex + 1) % product.images.length)}
            aria-label="Next image"
          >
            <ChevronRight size={26} />
          </button>
          <div className="lightbox__dots">
            {product.images.map((image, index) => (
              <button
                type="button"
                key={image}
                className={imageIndex === index ? "is-active" : ""}
                onClick={() => setImageIndex(index)}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
