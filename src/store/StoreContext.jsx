import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { productById, products } from "../data/products";
import { readStorage, writeStorage } from "../lib/format";

const STORAGE_KEY = "shopbondhu-state-v1";

const seedOrders = [
  {
    id: "SB-2026-1042",
    date: "2026-10-27T10:24:00.000Z",
    status: "Shipped",
    payment: "bKash",
    delivery: "Standard delivery",
    customer: "Nusrat Jahan",
    phone: "01712345678",
    email: "nusrat.jahan@example.com",
    address: {
      name: "Nusrat Jahan",
      phone: "01712345678",
      email: "nusrat.jahan@example.com",
      street: "House 14, Road 7, Dhanmondi",
      city: "Dhaka",
      area: "Dhanmondi",
      notes: "Please call before arriving.",
    },
    items: [
      {
        id: "sb-101",
        name: "Aurora ANC Wireless Headphones",
        price: 7490,
        qty: 1,
        image: "/images/headphones.webp",
        options: { color: "Forest" },
      },
    ],
    totals: { subtotal: 7490, discount: 0, shipping: 0, total: 7490 },
    coupon: null,
    trackingCode: "SPB-DHK-8831042",
  },
  {
    id: "SB-2026-1038",
    date: "2026-10-19T08:12:00.000Z",
    status: "Delivered",
    payment: "Card",
    delivery: "Express delivery",
    customer: "Nusrat Jahan",
    phone: "01712345678",
    email: "nusrat.jahan@example.com",
    address: {
      name: "Nusrat Jahan",
      phone: "01712345678",
      email: "nusrat.jahan@example.com",
      street: "House 14, Road 7, Dhanmondi",
      city: "Dhaka",
      area: "Dhanmondi",
      notes: "",
    },
    items: [
      {
        id: "sb-401",
        name: "Calm Ritual Skincare Set",
        price: 2490,
        qty: 1,
        image: "/images/skincare.webp",
        options: {},
      },
      {
        id: "sb-601",
        name: "2026 Weekly Planner",
        price: 650,
        qty: 2,
        image: "/images/planner.webp",
        options: {},
      },
    ],
    totals: { subtotal: 3790, discount: 300, shipping: 0, total: 3490 },
    coupon: "BONDHU10",
    trackingCode: "SPB-DHK-8829038",
  },
];

const coupons = {
  BONDHU10: {
    code: "BONDHU10",
    label: "10% off your order",
    type: "percent",
    value: 10,
    max: 300,
    min: 0,
  },
  NEW200: {
    code: "NEW200",
    label: "৳200 off orders over ৳2,000",
    type: "fixed",
    value: 200,
    min: 2000,
  },
};

const loadInitial = () => readStorage(STORAGE_KEY, null) ?? {};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const saved = useRef(loadInitial());
  const [cart, setCart] = useState(saved.current.cart ?? []);
  const [wishlist, setWishlist] = useState(saved.current.wishlist ?? []);
  const [orders, setOrders] = useState(saved.current.orders ?? seedOrders);
  const [user, setUser] = useState(saved.current.user ?? null);
  const [coupon, setCoupon] = useState(saved.current.coupon ?? null);
  const [recentlyViewed, setRecentlyViewed] = useState(saved.current.recentlyViewed ?? []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    writeStorage(STORAGE_KEY, { cart, wishlist, orders, user, coupon, recentlyViewed });
  }, [cart, wishlist, orders, user, coupon, recentlyViewed]);

  const addToast = useCallback((message, tone = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToCart = useCallback(
    (product, { qty = 1, color = "", size = "", open = true } = {}) => {
      const stock = product.stock ?? 99;
      if (stock <= 0) {
        addToast("This item is currently out of stock.", "error");
        return false;
      }
      const key = `${product.id}|${color}|${size}`;
      setCart((current) => {
        const existing = current.find((line) => line.key === key);
        if (existing) {
          return current.map((line) =>
            line.key === key
              ? { ...line, qty: Math.min(stock, line.qty + qty) }
              : line
          );
        }
        return [
          ...current,
          {
            key,
            id: product.id,
            qty: Math.min(stock, qty),
            options: { color, size },
          },
        ];
      });
      addToast(`${product.name} added to your cart`);
      if (open) setDrawerOpen(true);
      return true;
    },
    [addToast]
  );

  const updateQty = useCallback((key, qty) => {
    setCart((current) =>
      current
        .map((line) => {
          if (line.key !== key) return line;
          const product = productById(line.id);
          const max = product?.stock ?? 99;
          return { ...line, qty: Math.max(0, Math.min(max, qty)) };
        })
        .filter((line) => line.qty > 0)
    );
  }, []);

  const removeItem = useCallback(
    (key) => {
      setCart((current) => current.filter((line) => line.key !== key));
      addToast("Item removed from cart", "neutral");
    },
    [addToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((current) => {
        const exists = current.includes(id);
        addToast(exists ? "Removed from wishlist" : "Saved to your wishlist", "neutral");
        return exists ? current.filter((item) => item !== id) : [...current, id];
      });
    },
    [addToast]
  );

  const markViewed = useCallback((id) => {
    setRecentlyViewed((current) => [id, ...current.filter((item) => item !== id)].slice(0, 8));
  }, []);

  const cartLines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = productById(line.id);
          return product ? { ...line, product, lineTotal: product.price * line.qty } : null;
        })
        .filter(Boolean),
    [cart]
  );

  const subtotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [cartLines]
  );

  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart]);

  const discount = useMemo(() => {
    if (!coupon || subtotal < (coupon.min ?? 0)) return 0;
    const value =
      coupon.type === "percent"
        ? Math.min((subtotal * coupon.value) / 100, coupon.max ?? Infinity)
        : coupon.value;
    return Math.min(subtotal, Math.round(value));
  }, [coupon, subtotal]);

  const applyCoupon = useCallback(
    (rawCode) => {
      const code = rawCode.trim().toUpperCase();
      if (!code) return { ok: false, message: "Enter a coupon code to continue." };
      const found = coupons[code];
      if (!found) return { ok: false, message: "That code doesn't look right. Try BONDHU10." };
      if (subtotal < (found.min ?? 0)) {
        return {
          ok: false,
          message: `Add ${(found.min - subtotal).toLocaleString("en-US")}৳ more to use this code.`,
        };
      }
      setCoupon(found);
      addToast(`${found.code} applied — ${found.label.toLowerCase()}`);
      return { ok: true, message: found.label };
    },
    [subtotal, addToast]
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const placeOrder = useCallback(
    ({ address, delivery, payment, shipping }) => {
      const lines = cartLines.map((line) => ({
        id: line.id,
        name: line.product.name,
        price: line.product.price,
        qty: line.qty,
        image: line.product.images[0],
        options: line.options,
      }));
      const number = Math.floor(1100 + Math.random() * 8800);
      const order = {
        id: `SB-2026-${number}`,
        date: new Date().toISOString(),
        status: "Placed",
        payment,
        delivery,
        customer: address.name,
        phone: address.phone,
        email: address.email,
        address,
        items: lines,
        totals: {
          subtotal,
          discount,
          shipping,
          total: subtotal - discount + shipping,
        },
        coupon: coupon?.code ?? null,
        trackingCode: `SPB-${address.city.slice(0, 3).toUpperCase()}-${number}`,
      };
      setOrders((current) => [order, ...current]);
      setCart([]);
      setCoupon(null);
      return order;
    },
    [cartLines, subtotal, discount, coupon]
  );

  const signIn = useCallback(
    ({ email, name }) => {
      const displayName =
        name?.trim() ||
        email
          .split("@")[0]
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      setUser({ name: displayName, email });
      addToast(`Welcome back, ${displayName.split(" ")[0]}!`);
    },
    [addToast]
  );

  const signOut = useCallback(() => {
    setUser(null);
    addToast("You're signed out. See you soon!", "neutral");
  }, [addToast]);

  const recommendations = useMemo(
    () =>
      products
        .filter((product) => !cart.some((line) => line.id === product.id))
        .slice(0, 4),
    [cart]
  );

  const value = {
    cart,
    cartLines,
    cartCount,
    subtotal,
    discount,
    coupon,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    wishlist,
    toggleWishlist,
    orders,
    placeOrder,
    user,
    signIn,
    signOut,
    recentlyViewed,
    markViewed,
    drawerOpen,
    setDrawerOpen,
    toasts,
    addToast,
    dismissToast,
    recommendations,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
};
