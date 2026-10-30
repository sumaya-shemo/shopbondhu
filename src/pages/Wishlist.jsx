import { Link } from "react-router-dom";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { productById, products } from "../data/products";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import TrustStrip from "../components/TrustStrip";

export default function Wishlist() {
  const { wishlist, recommendations } = useStore();
  const saved = wishlist.map((id) => productById(id)).filter(Boolean);
  const suggestions = products
    .filter((product) => !wishlist.includes(product.id) && product.badge === "Bestseller")
    .slice(0, 4);

  return (
    <div className="wishlist-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb__sep">/</span>
          <span>Wishlist</span>
        </nav>

        <header className="page-head">
          <div>
            <span className="eyebrow">
              <Heart size={14} /> Saved for later
            </span>
            <h1>Your wishlist</h1>
            <p>
              {saved.length > 0
                ? `${saved.length} ${saved.length === 1 ? "thing" : "things"} you've got your eye on. We'll keep them safe.`
                : "A little collection of things you love. Tap the heart on any product to save it here."}
            </p>
          </div>
          <Link className="text-link" to="/shop">
            Continue shopping <ArrowRight size={16} />
          </Link>
        </header>

        {saved.length === 0 ? (
          <div className="wishlist-empty">
            <span className="wishlist-empty__icon">
              <Heart size={32} />
            </span>
            <h2>Nothing saved yet.</h2>
            <p>Found something you like? Tap the heart and it will live here until you're ready.</p>
            <Link className="btn btn--primary" to="/shop">
              Explore the shop <ArrowRight size={16} />
            </Link>
            <div className="wishlist-empty__hint">
              <Sparkles size={15} /> Tip: your wishlist is saved on this device.
            </div>
          </div>
        ) : (
          <div className="product-grid product-grid--4">
            {saved.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 50}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        )}

        <section className="section wishlist-suggest">
          <SectionHeading
            eyebrow="Loved by others"
            title="You might also love these"
            copy="A few bestsellers to add to the shortlist."
            link="/shop?filter=bestsellers"
            linkLabel="All bestsellers"
          />
          <div className="product-grid product-grid--4">
            {suggestions.map((product, index) => (
              <Reveal key={product.id} delay={index * 50}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <TrustStrip compact />
    </div>
  );
}
