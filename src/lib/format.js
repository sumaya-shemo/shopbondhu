export const formatBDT = (value) =>
  `৳${Math.round(value).toLocaleString("en-US")}`;

export const FREE_SHIPPING_THRESHOLD = 1500;
export const STANDARD_SHIPPING = 70;
export const EXPRESS_SHIPPING = 120;

export const standardShipping = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING;

export const discountPercent = (price, compareAt) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

export const stockLabel = (stock) => {
  if (stock <= 0) return { text: "Out of stock", tone: "out" };
  if (stock <= 5) return { text: `Only ${stock} left`, tone: "low" };
  return { text: "In stock", tone: "in" };
};

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be unavailable */
  }
};

export const orderTimeline = (order) => {
  const steps = ["Placed", "Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];
  const index = Math.max(0, steps.indexOf(order.status));
  return steps.map((label, i) => ({
    label,
    done: i <= index,
    current: i === index,
    date:
      i <= index
        ? new Date(new Date(order.date).getTime() + i * 22 * 60 * 60 * 1000).toLocaleDateString(
            "en-GB",
            { day: "numeric", month: "short" }
          )
        : null,
  }));
};
