import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
  X,
  Headphones,
  Sparkles,
} from "lucide-react";
import { categories } from "../data/products";
import { useStore } from "../store/StoreContext";
import Logo from "./Logo";
import SearchBox from "./SearchBox";

const announcements = [
  "Free delivery on orders over ৳1,500",
  "7-day easy returns, no awkward questions",
  "Authentic products, sourced with care",
];

export default function Header() {
  const { cartCount, wishlist, setDrawerOpen, user } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcement, setAnnouncement] = useState(0);
  const [catsOpen, setCatsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setAnnouncement((current) => (current + 1) % announcements.length),
      4200
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSearch(false);
    setCatsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="announcement">
        <div className="container announcement__inner">
          <p key={announcement} className="announcement__message">
            <Sparkles size={14} />
            {announcements[announcement]}
          </p>
          <div className="announcement__links">
            <Link to="/track">Track order</Link>
            <span aria-hidden="true">·</span>
            <Link to="/support">Need help?</Link>
          </div>
        </div>
      </div>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container site-header__main">
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          <Logo />

          <div className="site-header__search">
            <SearchBox />
          </div>

          <div className="site-header__actions">
            <button
              type="button"
              className="icon-btn mobile-search-toggle"
              onClick={() => setMobileSearch((value) => !value)}
              aria-label="Toggle search"
              aria-expanded={mobileSearch}
            >
              <Search size={21} />
            </button>
            <Link className="header-action" to="/account">
              <span className="header-action__icon">
                <UserRound size={20} />
              </span>
              <span className="header-action__text">
                <small>{user ? "Hello," : "Sign in"}</small>
                <strong>{user ? user.name.split(" ")[0] : "Account"}</strong>
              </span>
            </Link>
            <Link className="header-action header-action--icon" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}>
              <span className="header-action__icon">
                <Heart size={20} />
                {wishlist.length > 0 && <span className="count-badge">{wishlist.length}</span>}
              </span>
              <span className="header-action__text">
                <small>Saved</small>
                <strong>Wishlist</strong>
              </span>
            </Link>
            <button
              type="button"
              className="header-action header-action--icon header-cart"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Open cart, ${cartCount} items`}
            >
              <span className="header-action__icon">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="count-badge count-badge--solid">{cartCount}</span>}
              </span>
              <span className="header-action__text">
                <small>Your bag</small>
                <strong>Cart</strong>
              </span>
            </button>
          </div>
        </div>

        <div className={`site-header__search-mobile ${mobileSearch ? "is-open" : ""}`}>
          <div className="container">
            <SearchBox autoFocus={mobileSearch} placeholder="Search ShopBondhu" />
          </div>
        </div>

        <nav className="category-nav" aria-label="Main navigation">
          <div className="container category-nav__inner">
            <div className="category-nav__cats">
              <button
                type="button"
                className="category-nav__all"
                onClick={() => setCatsOpen((value) => !value)}
                aria-expanded={catsOpen}
              >
                Categories <ChevronDown size={14} className={catsOpen ? "rotated" : ""} />
              </button>
              {catsOpen && (
                <>
                  <div className="category-mega-backdrop" onClick={() => setCatsOpen(false)} />
                  <div className="category-mega">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/shop?category=${category.slug}`}
                        className="category-mega__item"
                      >
                        <img src={category.image} alt="" />
                        <span>
                          <strong>{category.name}</strong>
                          <small>{category.blurb}</small>
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            {categories.map((category) => (
              <NavLink
                key={category.slug}
                to={`/shop?category=${category.slug}`}
                className="category-nav__link"
              >
                {category.short}
              </NavLink>
            ))}
            <NavLink to="/shop?filter=deals" className="category-nav__link category-nav__deal">
              Today's deals
            </NavLink>
            <span className="category-nav__spacer" />
            <NavLink to="/track" className="category-nav__utility">
              <Truck size={14} /> Track order
            </NavLink>
            <NavLink to="/support" className="category-nav__utility">
              <Headphones size={14} /> Support
            </NavLink>
          </div>
        </nav>
      </header>

      <div className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-menu__backdrop" onClick={() => setMobileOpen(false)} />
        <div className="mobile-menu__panel" role="dialog" aria-label="Menu" aria-modal="true">
          <div className="mobile-menu__head">
            <Logo />
            <button type="button" className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="mobile-menu__body">
            <Link className="mobile-menu__cta" to="/shop">
              <ShoppingBag size={18} /> Shop all products
            </Link>
            <div className="mobile-menu__group">
              <span className="mobile-menu__label">Shop by category</span>
              {categories.map((category) => (
                <Link key={category.slug} to={`/shop?category=${category.slug}`} className="mobile-menu__cat">
                  <img src={category.image} alt="" />
                  <span>
                    <strong>{category.name}</strong>
                    <small>{category.blurb}</small>
                  </span>
                  <ChevronDown size={16} className="chev-right" />
                </Link>
              ))}
            </div>
            <div className="mobile-menu__group">
              <span className="mobile-menu__label">More from ShopBondhu</span>
              <Link to="/shop?filter=deals" className="mobile-menu__link">
                <Sparkles size={17} /> Today's deals
              </Link>
              <Link to="/track" className="mobile-menu__link">
                <PackageSearch size={17} /> Track your order
              </Link>
              <Link to="/support" className="mobile-menu__link">
                <Headphones size={17} /> Customer support
              </Link>
              <Link to="/wishlist" className="mobile-menu__link">
                <Heart size={17} /> Your wishlist ({wishlist.length})
              </Link>
              <Link to="/account" className="mobile-menu__link">
                <UserRound size={17} /> {user ? "Your account" : "Sign in / create account"}
              </Link>
            </div>
            <div className="mobile-menu__help">
              <strong>We're here every day, 9am–9pm.</strong>
              <a href="tel:+8809612345678">+880 9612 345 678</a>
              <a href="mailto:hello@shopbondhu.com">hello@shopbondhu.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
