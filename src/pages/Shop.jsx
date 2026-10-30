import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { categories, categoryBySlug, products } from "../data/products";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { cn } from "../lib/format";

const PAGE_SIZE = 9;
const MAX_PRICE = 8000;

const sortOptions = [
  { value: "featured", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest savings" },
  { value: "newest", label: "Newest first" },
];

function FilterPanel({ params, setParam, clearAll, counts }) {
  const category = params.get("category") || "all";
  const maxPrice = Number(params.get("max") || MAX_PRICE);
  const rating = Number(params.get("rating") || 0);
  const inStock = params.get("stock") === "in";

  return (
    <div className="filters">
      <div className="filters__head">
        <h2>Filters</h2>
        <button type="button" className="text-button" onClick={clearAll}>
          Clear all
        </button>
      </div>

      <fieldset className="filter-group">
        <legend>Category</legend>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={category === "all"}
            onChange={() => setParam("category", null)}
          />
          <span>All products</span>
          <small>{products.length}</small>
        </label>
        {categories.map((item) => (
          <label className="filter-option" key={item.slug}>
            <input
              type="radio"
              name="category"
              checked={category === item.slug}
              onChange={() => setParam("category", item.slug)}
            />
            <span>{item.name}</span>
            <small>{counts[item.slug]}</small>
          </label>
        ))}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price</legend>
        <div className="filter-price">
          <div className="filter-price__labels">
            <span>Up to</span>
            <strong>৳{maxPrice.toLocaleString("en-US")}</strong>
          </div>
          <input
            type="range"
            min="500"
            max={MAX_PRICE}
            step="250"
            value={maxPrice}
            onChange={(event) => setParam("max", event.target.value === String(MAX_PRICE) ? null : event.target.value)}
            aria-label="Maximum price"
            style={{ "--fill": `${((maxPrice - 500) / (MAX_PRICE - 500)) * 100}%` }}
          />
          <div className="filter-price__range">
            <span>৳500</span>
            <span>৳8,000+</span>
          </div>
          <div className="filter-price__chips">
            {[1000, 2000, 3500, 5000].map((price) => (
              <button
                type="button"
                key={price}
                className={maxPrice === price ? "is-active" : ""}
                onClick={() => setParam("max", price)}
              >
                Under {price / 1000}k
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset className="filter-group">
        <legend>Customer rating</legend>
        {[4.5, 4, 3.5].map((value) => (
          <label className="filter-option" key={value}>
            <input
              type="radio"
              name="rating"
              checked={rating === value}
              onChange={() => setParam("rating", rating === value ? null : String(value))}
            />
            <span className="filter-rating">
              <Star size={13} fill="currentColor" /> {value} & up
            </span>
            <small>{products.filter((p) => p.rating >= value).length}</small>
          </label>
        ))}
        {rating > 0 && (
          <button type="button" className="text-button text-button--sm" onClick={() => setParam("rating", null)}>
            Clear rating
          </button>
        )}
      </fieldset>

      <fieldset className="filter-group">
        <legend>Availability</legend>
        <label className="filter-option filter-option--switch">
          <span>In stock only</span>
          <input
            type="checkbox"
            className="switch"
            checked={inStock}
            onChange={(event) => setParam("stock", event.target.checked ? "in" : null)}
          />
        </label>
        <p className="filter-note">We show live stock, so you never order something that isn't there.</p>
      </fieldset>

      <div className="filter-help">
        <Sparkles size={17} />
        <p>
          <strong>Not sure?</strong> Message our team on WhatsApp and we'll help you choose.
        </p>
        <a href="https://wa.me/8809612345678" target="_blank" rel="noreferrer">
          Chat with a human <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = params.get("q") || "";
  const activeCategory = params.get("category") || "all";
  const filter = params.get("filter") || "all";
  const sort = params.get("sort") || "featured";
  const page = Math.max(1, Number(params.get("page") || 1));
  const maxPrice = Number(params.get("max") || MAX_PRICE);
  const rating = Number(params.get("rating") || 0);
  const inStock = params.get("stock") === "in";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value == null || value === "" || value === "all") next.delete(key);
    else next.set(key, String(value));
    next.delete("page");
    setParams(next);
  };

  const clearAll = () => setParams({});

  const goPage = (value) => {
    const next = new URLSearchParams(params);
    if (value <= 1) next.delete("page");
    else next.set("page", String(value));
    setParams(next);
    document.getElementById("shop-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const counts = useMemo(() => {
    const result = {};
    categories.forEach((category) => {
      result[category.slug] = products.filter((product) => product.category === category.slug).length;
    });
    return result;
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((product) => {
      if (activeCategory !== "all" && product.category !== activeCategory) return false;
      if (filter === "deals" && !product.deal) return false;
      if (filter === "bestsellers" && product.badge !== "Bestseller") return false;
      if (filter === "new" && product.badge !== "New") return false;
      if (maxPrice < MAX_PRICE && product.price > maxPrice) return false;
      if (rating > 0 && product.rating < rating) return false;
      if (inStock && product.stock <= 0) return false;
      if (term) {
        const haystack = [product.name, product.short, product.category, ...(product.tags ?? [])]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort(
          (a, b) =>
            (b.compareAt ? (b.compareAt - b.price) / b.compareAt : 0) -
            (a.compareAt ? (a.compareAt - a.price) / a.compareAt : 0)
        );
        break;
      case "newest":
        list.sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
        break;
      default:
        list.sort((a, b) => a.featured - b.featured);
    }
    return list;
  }, [query, activeCategory, filter, maxPrice, rating, inStock, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const category = categoryBySlug(activeCategory);

  const heading =
    filter === "deals"
      ? "Today's deals"
      : filter === "bestsellers"
        ? "The bestsellers"
        : filter === "new"
          ? "Just landed"
          : category
            ? category.name
            : query
              ? `Results for “${query}”`
              : "All the good things";

  const intro =
    filter === "deals"
      ? "Honest reductions on products we actually stock. No fake countdowns, no inflated prices."
      : filter === "bestsellers"
        ? "The products our customers keep coming back for — rated and reviewed by real shoppers."
        : filter === "new"
          ? "A small, considered drop of new arrivals. Tried by our team before they reached the shelf."
          : category
            ? category.blurb
            : query
              ? `We found ${filtered.length} ${filtered.length === 1 ? "match" : "matches"} for your search.`
              : "Thoughtfully chosen everyday essentials, from a team that actually uses them.";

  const activeChips = [];
  if (activeCategory !== "all" && category) {
    activeChips.push({ key: "category", label: category.name, clear: () => setParam("category", null) });
  }
  if (query) activeChips.push({ key: "q", label: `“${query}”`, clear: () => setParam("q", null) });
  if (filter !== "all") {
    activeChips.push({
      key: "filter",
      label: filter === "deals" ? "Deals" : filter === "bestsellers" ? "Bestsellers" : "New in",
      clear: () => setParam("filter", null),
    });
  }
  if (maxPrice < MAX_PRICE) {
    activeChips.push({ key: "max", label: `Under ৳${maxPrice.toLocaleString("en-US")}`, clear: () => setParam("max", null) });
  }
  if (rating > 0) activeChips.push({ key: "rating", label: `${rating}★ & up`, clear: () => setParam("rating", null) });
  if (inStock) activeChips.push({ key: "stock", label: "In stock", clear: () => setParam("stock", null) });

  return (
    <div className="shop-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/shop">Shop</Link>
          {category && (
            <>
              <ChevronRight size={13} />
              <span>{category.name}</span>
            </>
          )}
        </nav>

        <header className="shop-hero">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> ShopBondhu edit
            </span>
            <h1>{heading}</h1>
            <p>{intro}</p>
          </div>
          {category && (
            <div className="shop-hero__cat">
              <img src={category.image} alt="" />
              <span>{counts[category.slug]} products in this collection</span>
            </div>
          )}
        </header>

        <div className="shop-layout" id="shop-results">
          <aside className="shop-sidebar" aria-label="Product filters">
            <FilterPanel params={params} setParam={setParam} clearAll={clearAll} counts={counts} />
          </aside>

          <div className="shop-main">
            <div className="shop-toolbar">
              <div className="shop-toolbar__left">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm shop-filter-btn"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={16} /> Filters
                  {activeChips.length > 0 && <span className="filter-count">{activeChips.length}</span>}
                </button>
                <p>
                  <strong>{filtered.length}</strong> {filtered.length === 1 ? "product" : "products"}
                  {query && <span> for “{query}”</span>}
                </p>
              </div>
              <div className="shop-toolbar__right">
                <div className="view-toggle" role="group" aria-label="View style">
                  <button
                    type="button"
                    className={view === "grid" ? "is-active" : ""}
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    type="button"
                    className={view === "list" ? "is-active" : ""}
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                  >
                    <List size={17} />
                  </button>
                </div>
                <label className="sort-select">
                  <span className="sr-only">Sort products</span>
                  <select value={sort} onChange={(event) => setParam("sort", event.target.value)}>
                    {sortOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="active-filters">
                {activeChips.map((chip) => (
                  <button type="button" key={chip.key} className="filter-chip" onClick={chip.clear}>
                    {chip.label} <X size={13} />
                  </button>
                ))}
                <button type="button" className="text-button text-button--sm" onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}

            {visible.length === 0 ? (
              <div className="shop-empty">
                <span className="shop-empty__icon">
                  <Sparkles size={26} />
                </span>
                <h2>Nothing matched just yet.</h2>
                <p>
                  Try removing a filter, widening your price range, or searching for something like
                  “headphones” or “mug”.
                </p>
                <button type="button" className="btn btn--primary" onClick={clearAll}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className={cn("product-grid", view === "grid" ? "product-grid--3" : "product-grid--list")}>
                  {visible.map((product, index) => (
                    <Reveal key={product.id} delay={(index % 3) * 50}>
                      <ProductCard product={product} index={index} />
                    </Reveal>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Pagination">
                    <button
                      type="button"
                      className="pagination__arrow"
                      onClick={() => goPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                      <button
                        type="button"
                        key={number}
                        className={number === currentPage ? "is-active" : ""}
                        onClick={() => goPage(number)}
                        aria-label={`Page ${number}`}
                        aria-current={number === currentPage ? "page" : undefined}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="pagination__arrow"
                      onClick={() => goPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight size={17} />
                    </button>
                    <span className="pagination__note">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </span>
                  </nav>
                )}
              </>
            )}

            <div className="shop-note">
              <div>
                <strong>A note on stock</strong>
                <p>
                  Stock numbers are live and updated as orders come in. If something sells out, join
                  the waitlist on the product page and we'll email you the moment it returns.
                </p>
              </div>
              <Link className="text-link" to="/support">
                Read our buying promise <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="filter-drawer__backdrop" onClick={() => setFiltersOpen(false)} />
          <div className="filter-drawer__panel">
            <div className="filter-drawer__head">
              <strong>Refine your search</strong>
              <button type="button" className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            <div className="filter-drawer__body">
              <FilterPanel params={params} setParam={setParam} clearAll={clearAll} counts={counts} />
            </div>
            <div className="filter-drawer__foot">
              <button type="button" className="btn btn--ghost" onClick={clearAll}>
                Clear all
              </button>
              <button type="button" className="btn btn--primary" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
