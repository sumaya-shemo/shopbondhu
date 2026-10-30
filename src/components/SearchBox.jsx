import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search, X } from "lucide-react";
import { categories, products } from "../data/products";
import { formatBDT } from "../lib/format";

export default function SearchBox({ variant = "header", placeholder, autoFocus = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return products
      .filter((product) =>
        [product.name, product.short, product.category, ...(product.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .slice(0, 5);
  }, [query]);

  const categoryHits = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return categories.filter((category) => category.name.toLowerCase().includes(term)).slice(0, 2);
  }, [query]);

  useEffect(() => {
    const handler = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) {
      inputRef.current?.focus();
      return;
    }
    navigate(`/shop?q=${encodeURIComponent(term)}`);
    setOpen(false);
    setQuery("");
  };

  const goProduct = (slug) => {
    navigate(`/product/${slug}`);
    setOpen(false);
    setQuery("");
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div className={`search search--${variant}`} ref={wrapRef}>
      <form className="search__form" onSubmit={submit} role="search">
        <Search size={variant === "hero" ? 20 : 18} className="search__icon" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder ?? "Search for products, brands or categories"}
          aria-label="Search products"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          autoFocus={autoFocus}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="search__clear"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        <button type="submit" className="search__submit">
          <span>Search</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {showDropdown && (
        <div className="search__panel" id="search-suggestions">
          {categoryHits.length > 0 && (
            <div className="search__group">
              <span className="search__label">Categories</span>
              {categoryHits.map((category) => (
                <button
                  type="button"
                  key={category.slug}
                  className="search__category"
                  onClick={() => {
                    navigate(`/shop?category=${category.slug}`);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="search__category-dot" style={{ background: category.accent }}>
                    <Search size={13} />
                  </span>
                  {category.name}
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          )}
          {results.length > 0 ? (
            <div className="search__group">
              <span className="search__label">Products</span>
              {results.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  className="search__result"
                  onClick={() => goProduct(product.slug)}
                >
                  <img src={product.images[0]} alt="" />
                  <span className="search__result-copy">
                    <strong>{product.name}</strong>
                    <span>
                      {product.category} · {formatBDT(product.price)}
                    </span>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
          ) : (
            categoryHits.length === 0 && (
              <div className="search__empty">
                <p>No matches for “{query}” yet.</p>
                <span>Try “headphones”, “mug” or “skincare”.</span>
              </div>
            )
          )}
          <button type="button" className="search__all" onClick={submit}>
            See all results for “{query.trim()}”
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
