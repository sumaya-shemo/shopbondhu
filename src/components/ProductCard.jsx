import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { discountPercent, formatBDT, stockLabel } from "../lib/format";
import { useStore } from "../store/StoreContext";
import RatingStars from "./RatingStars";
import Price from "./Price";

export default function ProductCard({ product, index = 0, compact = false }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const saved = wishlist.includes(product.id);
  const off = discountPercent(product.price, product.compareAt);
  const stock = stockLabel(product.stock);
  const needsChoice = Boolean(product.sizes?.length);

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.stock <= 0) return;
    if (needsChoice) {
      navigate(`/product/${product.slug}`);
      return;
    }
    addToCart(product, { color: product.colors?.[0]?.name ?? "" });
  };

  return (
    <article
      className={`product-card ${compact ? "product-card--compact" : ""}`}
      style={{ "--i": index }}
    >
      <div className="product-card__media">
        <Link to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading={index > 3 ? "lazy" : "eager"}
            width="880"
            height="1080"
          />
          {product.images[1] && (
            <img
              className="product-card__hover-img"
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          )}
        </Link>
        <div className="product-card__badges">
          {product.badge && (
            <span className={`badge badge--${product.badge.toLowerCase().replace(/\s/g, "-")}`}>
              {product.badge}
            </span>
          )}
          {off >= 20 && !product.badge && <span className="badge badge--deal">−{off}%</span>}
          {stock.tone === "low" && <span className="badge badge--low">{stock.text}</span>}
        </div>
        <button
          type="button"
          className={`icon-btn product-card__heart ${saved ? "is-active" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        {product.stock > 0 && (
          <button
            type="button"
            className="product-card__quick"
            onClick={handleAdd}
            aria-label={needsChoice ? `Choose a size for ${product.name}` : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
            {needsChoice ? "Choose size" : "Quick add"}
          </button>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.category === "stationery" ? "Stationery" : product.category}</span>
          <span className="product-card__rating">
            <RatingStars rating={product.rating} size={12} /> {product.rating.toFixed(1)}
          </span>
        </div>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card__short">{product.short}</p>
        <div className="product-card__colors">
          {product.colors?.slice(0, 3).map((color) => (
            <span
              key={color.name}
              className="swatch swatch--sm"
              style={{ background: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors?.length > 0 && (
            <span className="product-card__color-label">
              {product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}
            </span>
          )}
        </div>
        <div className="product-card__foot">
          <div>
            <Price price={product.price} compareAt={product.compareAt} />
            <span className={`stock stock--${stock.tone}`}>
              {product.stock <= 0 ? "Out of stock" : stock.tone === "low" ? stock.text : "In stock"}
            </span>
          </div>
          <button
            type="button"
            className="product-card__add"
            onClick={handleAdd}
            disabled={product.stock <= 0}
            aria-label={needsChoice ? `Choose a size for ${product.name}` : `Add ${product.name} to cart`}
          >
            <ShoppingBag size={17} />
            <span>{product.stock <= 0 ? "Sold out" : needsChoice ? "Choose" : "Add"}</span>
            <span className="sr-only"> — {formatBDT(product.price)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
