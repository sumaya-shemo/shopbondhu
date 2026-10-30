import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Package,
  PackageSearch,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import { formatBDT, orderTimeline } from "../lib/format";
import { productById } from "../data/products";
import RatingStars from "../components/RatingStars";

const demoEmail = "nusrat.jahan@example.com";
const demoPassword = "bondhu123";

function SignIn() {
  const { signIn, addToast } = useStore();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (mode === "create" && form.name.trim().length < 2) {
      setError("Please tell us your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }
    setError("");
    signIn({ email: form.email.trim(), name: mode === "create" ? form.name : "" });
  };

  const useDemo = () => {
    setForm({ name: "Nusrat Jahan", email: demoEmail, password: demoPassword });
    setError("");
    signIn({ email: demoEmail, name: "Nusrat Jahan" });
  };

  return (
    <div className="account-auth">
      <div className="account-auth__visual">
        <span className="eyebrow eyebrow--light">Hello again</span>
        <h1>Your ShopBondhu, all in one place.</h1>
        <p>
          Track orders, keep your wishlist close and check out faster — with the same friendly team
          behind you.
        </p>
        <ul>
          <li>
            <Package size={18} /> Order history and live tracking
          </li>
          <li>
            <Heart size={18} /> A wishlist that stays with you
          </li>
          <li>
            <MapPin size={18} /> Saved addresses for quicker checkout
          </li>
          <li>
            <Sparkles size={18} /> Early access to deals and new arrivals
          </li>
        </ul>
        <div className="account-auth__quote">
          <RatingStars rating={5} size={14} />
          <p>“It genuinely feels like shopping with a friend who has good taste.”</p>
          <span>— Farhana R., Chattogram</span>
        </div>
        <span className="account-auth__shape" aria-hidden="true" />
      </div>

      <div className="account-auth__form-wrap">
        <div className="account-auth__tabs" role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            className={mode === "signin" ? "is-active" : ""}
            onClick={() => {
              setMode("signin");
              setError("");
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "create"}
            className={mode === "create" ? "is-active" : ""}
            onClick={() => {
              setMode("create");
              setError("");
            }}
          >
            Create account
          </button>
        </div>

        <h2>{mode === "signin" ? "Welcome back." : "Nice to meet you."}</h2>
        <p className="account-auth__sub">
          {mode === "signin"
            ? "Sign in to see your orders, saved items and addresses."
            : "One minute now, much faster checkouts later."}
        </p>

        <form onSubmit={submit} noValidate>
          {mode === "create" && (
            <label className="field">
              <span className="field__label">Full name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => {
                  setForm({ ...form, name: event.target.value });
                  setError("");
                }}
                placeholder="e.g. Nusrat Jahan"
                autoComplete="name"
              />
            </label>
          )}
          <label className="field">
            <span className="field__label">Email address</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value });
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span className="field__label">
              Password
              {mode === "signin" && <button type="button" className="field__link">Forgot?</button>}
            </span>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => {
                  setForm({ ...form, password: event.target.value });
                  setError("");
                }}
                placeholder="At least 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn--primary btn--full">
            {mode === "signin" ? "Sign in" : "Create my account"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="account-auth__divider">
          <span>or</span>
        </div>
        <button type="button" className="btn btn--ghost btn--full" onClick={useDemo}>
          <CircleUserRound size={17} /> Use the demo account
        </button>
        <p className="account-auth__demo">
          Demo: {demoEmail} · password {demoPassword}
        </p>
        <p className="account-auth__terms">
          By continuing you agree to our <a href="#terms">terms</a> and{" "}
          <a href="#privacy">privacy policy</a>. This is a demo store — details are stored only in
          your browser.
        </p>
      </div>
    </div>
  );
}

function AccountHome({ orders }) {
  const { user, wishlist, toggleWishlist } = useStore();
  const latest = orders[0];
  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const timeline = latest ? orderTimeline(latest) : [];

  return (
    <div className="account-home">
      <div className="account-stats">
        <div>
          <span className="account-stats__icon">
            <Package size={19} />
          </span>
          <strong>{orders.length}</strong>
          <small>Total orders</small>
        </div>
        <div>
          <span className="account-stats__icon">
            <Truck size={19} />
          </span>
          <strong>{orders.filter((order) => order.status !== "Delivered").length}</strong>
          <small>On the way</small>
        </div>
        <div>
          <span className="account-stats__icon">
            <Heart size={19} />
          </span>
          <strong>{wishlist.length}</strong>
          <small>Wishlist items</small>
        </div>
        <div>
          <span className="account-stats__icon">
            <BadgeCheck size={19} />
          </span>
          <strong>{delivered}</strong>
          <small>Delivered</small>
        </div>
      </div>

      {latest ? (
        <section className="account-panel">
          <div className="account-panel__head">
            <div>
              <span className="eyebrow">Most recent</span>
              <h2>Your latest order</h2>
            </div>
            <Link className="text-link" to={`/order/${latest.id}`}>
              View order <ArrowRight size={15} />
            </Link>
          </div>
          <div className="latest-order">
            <div className="latest-order__main">
              <div className="latest-order__top">
                <span className="status-pill">{latest.status}</span>
                <span>
                  {latest.id} ·{" "}
                  {new Date(latest.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="latest-order__items">
                {latest.items.map((item) => (
                  <img key={item.id} src={item.image} alt={item.name} title={item.name} />
                ))}
                <span>
                  <strong>{formatBDT(latest.totals.total)}</strong>
                  <small>{latest.items.reduce((sum, item) => sum + item.qty, 0)} items</small>
                </span>
              </div>
              <div className="latest-order__timeline">
                {timeline.slice(0, 4).map((step) => (
                  <span key={step.label} className={step.done ? "is-done" : ""}>
                    <i />
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="latest-order__actions">
              <Link className="btn btn--primary btn--sm" to={`/track?order=${latest.id}&phone=${latest.phone}`}>
                <PackageSearch size={15} /> Track order
              </Link>
              <Link className="btn btn--ghost btn--sm" to={`/order/${latest.id}`}>
                Order details
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="account-empty">
          <ShoppingBag size={26} />
          <h2>No orders yet</h2>
          <p>When you place your first order, it'll show up here.</p>
          <Link className="btn btn--primary btn--sm" to="/shop">
            Start shopping
          </Link>
        </div>
      )}

      <div className="account-two-col">
        <section className="account-panel">
          <div className="account-panel__head">
            <h2>Your details</h2>
            <Link className="text-link" to="/account?tab=settings">
              Edit <ArrowRight size={14} />
            </Link>
          </div>
          <div className="account-detail">
            <CircleUserRound size={18} />
            <span>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </span>
          </div>
          <div className="account-detail">
            <MapPin size={18} />
            <span>
              <strong>Default address</strong>
              <small>House 14, Road 7, Dhanmondi, Dhaka 1209</small>
            </span>
          </div>
          <div className="account-detail">
            <Bell size={18} />
            <span>
              <strong>Order updates by SMS & email</strong>
              <small>On — you'll never miss a delivery.</small>
            </span>
          </div>
        </section>

        <section className="account-panel">
          <div className="account-panel__head">
            <h2>Saved for later</h2>
            <Link className="text-link" to="/wishlist">
              Wishlist <ArrowRight size={14} />
            </Link>
          </div>
          {wishlist.length === 0 ? (
            <div className="account-wishlist-empty">
              <Heart size={22} />
              <p>Nothing saved yet. Tap the heart on any product to keep it here.</p>
              <Link className="text-link" to="/shop">
                Find something lovely <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="account-wishlist-list">
              {wishlist.slice(0, 3).map((id) => {
                return (
                  <WishlistRow
                    key={id}
                    id={id}
                    onRemove={() => toggleWishlist(id)}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function WishlistRow({ id, onRemove }) {
  return (
    <div className="account-wishlist-row">
      <WishlistThumb id={id} />
      <button type="button" onClick={onRemove} aria-label="Remove from wishlist">
        <Heart size={15} fill="currentColor" />
      </button>
    </div>
  );
}

function WishlistThumb({ id }) {
  const product = requireProduct(id);
  if (!product) return null;
  return (
    <>
      <img src={product.images[0]} alt="" />
      <span>
        <Link to={`/product/${product.slug}`}>{product.name}</Link>
        <small>{formatBDT(product.price)}</small>
      </span>
    </>
  );
}

const requireProduct = (id) => productById(id);

function AccountOrders({ orders }) {
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    if (filter === "active") return orders.filter((order) => order.status !== "Delivered");
    if (filter === "delivered") return orders.filter((order) => order.status === "Delivered");
    return orders;
  }, [orders, filter]);

  return (
    <div className="account-orders">
      <div className="account-panel__head account-panel__head--row">
        <div>
          <span className="eyebrow">Order history</span>
          <h2>Your orders</h2>
        </div>
        <div className="segmented">
          {[
            ["all", "All"],
            ["active", "In progress"],
            ["delivered", "Delivered"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "is-active" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="account-empty">
          <Package size={26} />
          <h2>No orders here</h2>
          <p>Try another filter, or find something new in the shop.</p>
          <Link className="btn btn--primary btn--sm" to="/shop">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="order-history">
          {filtered.map((order) => (
            <details className="order-history__card" key={order.id}>
              <summary>
                <div className="order-history__summary">
                  <div>
                    <span className="status-pill">{order.status}</span>
                    <strong>Order {order.id}</strong>
                    <small>
                      {new Date(order.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {order.items.reduce((sum, item) => sum + item.qty, 0)} items
                    </small>
                  </div>
                  <div className="order-history__right">
                    <strong>{formatBDT(order.totals.total)}</strong>
                    <span>
                      {order.items.map((item) => (
                        <img key={item.id} src={item.image} alt="" />
                      ))}
                    </span>
                    <ChevronDown size={18} className="order-history__chev" />
                  </div>
                </div>
              </summary>
              <div className="order-history__body">
                <div className="order-history__items">
                  {order.items.map((item) => (
                    <div className="order-history__item" key={`${item.id}-${item.qty}`}>
                      <img src={item.image} alt="" />
                      <span>
                        <strong>{item.name}</strong>
                        <small>
                          {[item.options?.color, item.options?.size && `Size ${item.options.size}`]
                            .filter(Boolean)
                            .join(" · ")}{" "}
                          · Qty {item.qty}
                        </small>
                      </span>
                      <strong>{formatBDT(item.price * item.qty)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-history__meta">
                  <span>
                    <MapPin size={14} /> {order.address.area}, {order.address.city}
                  </span>
                  <span>
                    <ShoppingBag size={14} /> {order.payment}
                  </span>
                  <span>
                    <Truck size={14} /> {order.delivery}
                  </span>
                </div>
                <div className="order-history__actions">
                  <Link className="btn btn--primary btn--sm" to={`/track?order=${order.id}&phone=${order.phone}`}>
                    Track order
                  </Link>
                  <Link className="btn btn--ghost btn--sm" to={`/order/${order.id}`}>
                    View details
                  </Link>
                  <Link className="text-link" to="/support">
                    Need help?
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountAddresses() {
  const { addToast } = useStore();
  const [addresses, setAddresses] = useState([
    {
      label: "Home",
      name: "Nusrat Jahan",
      phone: "01712345678",
      street: "House 14, Road 7",
      area: "Dhanmondi",
      city: "Dhaka",
      postcode: "1209",
      isDefault: true,
    },
    {
      label: "Office",
      name: "Nusrat Jahan",
      phone: "01712345678",
      street: "Level 8, Concord Tower, Gulshan 1",
      area: "Gulshan",
      city: "Dhaka",
      postcode: "1212",
      isDefault: false,
    },
  ]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "Home", name: "", phone: "", street: "", area: "", city: "Dhaka" });

  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.street || !form.area || form.phone.length < 11) {
      addToast("Please fill in the name, phone and full address.", "error");
      return;
    }
    setAddresses([...addresses, { ...form, isDefault: false }]);
    setAdding(false);
    addToast("Address saved");
  };

  return (
    <div className="account-addresses">
      <div className="account-panel__head account-panel__head--row">
        <div>
          <span className="eyebrow">Delivery</span>
          <h2>Saved addresses</h2>
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAdding((value) => !value)}>
          <Plus size={16} /> Add address
        </button>
      </div>

      {adding && (
        <form className="address-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="field">
              <span className="field__label">Label</span>
              <select value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })}>
                <option>Home</option>
                <option>Office</option>
                <option>Other</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Full name</span>
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Recipient name" />
            </label>
            <label className="field">
              <span className="field__label">Phone</span>
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="01XXXXXXXXX" />
            </label>
            <label className="field">
              <span className="field__label">Street address</span>
              <input value={form.street} onChange={(event) => setForm({ ...form, street: event.target.value })} placeholder="House, road" />
            </label>
            <label className="field">
              <span className="field__label">Area</span>
              <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="e.g. Dhanmondi" />
            </label>
            <label className="field">
              <span className="field__label">City</span>
              <select value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
                {["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi"].map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="address-form__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary btn--sm">
              Save address
            </button>
          </div>
        </form>
      )}

      <div className="address-grid">
        {addresses.map((address, index) => (
          <div className="address-card" key={`${address.label}-${index}`}>
            <div className="address-card__top">
              <span>
                <MapPin size={15} /> {address.label}
              </span>
              {address.isDefault && <span className="address-card__default">Default</span>}
            </div>
            <strong>{address.name}</strong>
            <p>
              {address.street}, {address.area}
              <br />
              {address.city}
              {address.postcode ? ` ${address.postcode}` : ""}
              <br />
              {address.phone}
            </p>
            <div className="address-card__actions">
              <button type="button" onClick={() => addToast("Edit address — demo only.", "neutral")}>
                <Pencil size={14} /> Edit
              </button>
              {!address.isDefault && (
                <button
                  type="button"
                  onClick={() => {
                    setAddresses(
                      addresses.map((item, i) => ({ ...item, isDefault: i === index }))
                    );
                    addToast("Default address updated");
                  }}
                >
                  Set as default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSettings() {
  const { user, addToast, signOut } = useStore();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: "01712345678",
    marketing: true,
    sms: true,
  });

  return (
    <div className="account-settings">
      <div className="account-panel__head">
        <span className="eyebrow">Account</span>
        <h2>Profile & preferences</h2>
      </div>
      <form
        className="settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          addToast("Your details have been saved.");
        }}
      >
        <div className="form-grid">
          <label className="field">
            <span className="field__label">Full name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="field">
            <span className="field__label">Phone</span>
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
        </div>
        <div className="settings-toggles">
          <label>
            <span>
              <strong>Email updates</strong>
              <small>New arrivals, offers and order updates.</small>
            </span>
            <input
              type="checkbox"
              className="switch"
              checked={form.marketing}
              onChange={(event) => setForm({ ...form, marketing: event.target.checked })}
            />
          </label>
          <label>
            <span>
              <strong>SMS delivery updates</strong>
              <small>A heads-up before your parcel arrives.</small>
            </span>
            <input
              type="checkbox"
              className="switch"
              checked={form.sms}
              onChange={(event) => setForm({ ...form, sms: event.target.checked })}
            />
          </label>
        </div>
        <div className="settings-actions">
          <button type="submit" className="btn btn--primary btn--sm">
            Save changes
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </form>
      <div className="settings-security">
        <ShieldCheck size={20} />
        <div>
          <strong>Your data stays yours.</strong>
          <p>
            We never sell or share your details. Read our <a href="#privacy">privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user, orders, signOut } = useStore();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const setTab = (next) => {
    if (next === "overview") setParams({});
    else setParams({ tab: next });
  };

  if (!user) return <SignIn />;

  const tabs = [
    { key: "overview", label: "Overview", icon: CircleUserRound },
    { key: "orders", label: "My orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="account-page">
      <div className="account-hero">
        <div className="container account-hero__inner">
          <div className="account-hero__person">
            <span className="account-hero__avatar">{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
            <div>
              <span className="eyebrow eyebrow--light">Your account</span>
              <h1>Hi, {user.name.split(" ")[0]}.</h1>
              <p>Good to see you. Here's everything in one place.</p>
            </div>
          </div>
          <button type="button" className="btn btn--ghost-light btn--sm" onClick={signOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div className="container">
        <div className="account-layout">
          <aside className="account-nav">
            <nav aria-label="Account sections">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  className={tab === key ? "is-active" : ""}
                  onClick={() => setTab(key)}
                >
                  <Icon size={17} /> {label}
                  <ChevronRight size={15} className="account-nav__chev" />
                </button>
              ))}
              <Link to="/wishlist">
                <Heart size={17} /> Wishlist
                <ChevronRight size={15} className="account-nav__chev" />
              </Link>
              <Link to="/track">
                <PackageSearch size={17} /> Track an order
                <ChevronRight size={15} className="account-nav__chev" />
              </Link>
              <Link to="/support">
                <UserRound size={17} /> Get support
                <ChevronRight size={15} className="account-nav__chev" />
              </Link>
            </nav>
            <div className="account-nav__help">
              <Mail size={18} />
              <p>
                <strong>Need a hand?</strong>
                <a href="mailto:hello@shopbondhu.com">hello@shopbondhu.com</a>
              </p>
            </div>
          </aside>

          <div className="account-content">
            {tab === "overview" && <AccountHome orders={orders} />}
            {tab === "orders" && <AccountOrders orders={orders} />}
            {tab === "addresses" && <AccountAddresses />}
            {tab === "settings" && <AccountSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
