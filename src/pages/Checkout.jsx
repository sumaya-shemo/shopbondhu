import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  LockKeyhole,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useStore } from "../store/StoreContext";
import {
  EXPRESS_SHIPPING,
  formatBDT,
  standardShipping,
} from "../lib/format";

const cityOptions = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

const steps = [
  { key: 1, label: "Delivery" },
  { key: 2, label: "Payment" },
  { key: 3, label: "Review" },
];

function Field({ label, error, optional, hint, children }) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span className="field__label">
        {label}
        {optional && <small>Optional</small>}
      </span>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}

export default function Checkout() {
  const {
    cartLines,
    cartCount,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    placeOrder,
    user,
  } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [terms, setTerms] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    street: "",
    apartment: "",
    city: "Dhaka",
    area: "",
    postcode: "",
    notes: "",
  });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("bkash");
  const [paymentDetails, setPaymentDetails] = useState({
    wallet: "",
    card: "",
    expiry: "",
    cvc: "",
  });
  const [placing, setPlacing] = useState(false);

  const shipping = delivery === "express" ? EXPRESS_SHIPPING : standardShipping(subtotal);
  const total = subtotal - discount + shipping;

  const update = (key, value) => {
    setAddress((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validateStepOne = () => {
    const next = {};
    if (address.name.trim().length < 3) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address.email.trim()))
      next.email = "Enter a valid email address.";
    if (!/^01[3-9]\d{8}$/.test(address.phone.replace(/\s/g, "")))
      next.phone = "Enter an 11-digit Bangladeshi mobile number (e.g. 01712345678).";
    if (address.street.trim().length < 6) next.street = "Please enter your street address.";
    if (address.area.trim().length < 2) next.area = "Please enter your area or thana.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStepTwo = () => {
    const next = {};
    if (payment === "bkash" || payment === "nagad") {
      if (!/^01[3-9]\d{8}$/.test(paymentDetails.wallet.replace(/\s/g, "")))
        next.wallet = `Enter the ${payment === "bkash" ? "bKash" : "Nagad"} number you'll pay from.`;
    }
    if (payment === "card") {
      if (!/^\d{16}$/.test(paymentDetails.card.replace(/\s/g, "")))
        next.card = "Enter a valid 16-digit card number.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiry))
        next.expiry = "Use MM/YY format.";
      if (!/^\d{3,4}$/.test(paymentDetails.cvc)) next.cvc = "Enter the 3 or 4 digit CVC.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;
    setStep((current) => Math.min(3, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backStep = () => {
    setStep((current) => Math.max(1, current - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitCoupon = (event) => {
    event.preventDefault();
    const result = applyCoupon(couponCode);
    if (result.ok) {
      setCouponCode("");
      setCouponError("");
    } else {
      setCouponError(result.message);
    }
  };

  const fillSample = () => {
    setAddress({
      name: user?.name ?? "Nusrat Jahan",
      email: user?.email ?? "nusrat.jahan@example.com",
      phone: "01712345678",
      street: "House 14, Road 7",
      apartment: "Apt 4B",
      city: "Dhaka",
      area: "Dhanmondi",
      postcode: "1209",
      notes: "Please call before arriving.",
    });
    setErrors({});
  };

  const paymentLabel = {
    bkash: "bKash",
    nagad: "Nagad",
    card: "Credit / Debit card",
    cod: "Cash on delivery",
  }[payment];

  const handlePlaceOrder = () => {
    if (!terms) {
      setErrors({ terms: "Please accept the terms to place your order." });
      return;
    }
    setPlacing(true);
    window.setTimeout(() => {
      const order = placeOrder({
        address,
        delivery: delivery === "express" ? "Express delivery" : "Standard delivery",
        payment: paymentLabel,
        shipping,
      });
      setPlacing(false);
      navigate(`/order/${order.id}`, { state: { justPlaced: true }, replace: true });
    }, 650);
  };

  const summary = useMemo(
    () => (
      <aside className="checkout-summary">
        <div className="checkout-summary__head">
          <h2>Your order</h2>
          <Link to="/cart">Edit cart</Link>
        </div>
        <div className="checkout-items">
          {cartLines.map((line) => (
            <div className="checkout-item" key={line.key}>
              <div className="checkout-item__image">
                <img src={line.product.images[0]} alt="" />
                <span>{line.qty}</span>
              </div>
              <div>
                <Link to={`/product/${line.product.slug}`}>{line.product.name}</Link>
                <small>
                  {[line.options.color, line.options.size && `Size ${line.options.size}`]
                    .filter(Boolean)
                    .join(" · ") || line.product.category}
                </small>
              </div>
              <strong>{formatBDT(line.lineTotal)}</strong>
            </div>
          ))}
        </div>

        <div className="checkout-coupon">
          {coupon ? (
            <div className="coupon-applied">
              <span>
                <BadgeCheck size={16} /> <strong>{coupon.code}</strong> applied
              </span>
              <button type="button" onClick={removeCoupon} aria-label="Remove coupon">
                <X size={14} />
              </button>
            </div>
          ) : (
            <form onSubmit={submitCoupon}>
              <Tag size={15} />
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value);
                  setCouponError("");
                }}
                aria-label="Coupon code"
              />
              <button type="submit">Apply</button>
            </form>
          )}
          {couponError && (
            <p className="form-error" role="alert">
              {couponError}
            </p>
          )}
        </div>

        <div className="summary-row">
          <span>Subtotal ({cartCount} items)</span>
          <strong>{formatBDT(subtotal)}</strong>
        </div>
        {discount > 0 && (
          <div className="summary-row summary-row--discount">
            <span>Discount</span>
            <strong>−{formatBDT(discount)}</strong>
          </div>
        )}
        <div className="summary-row">
          <span>Delivery ({delivery === "express" ? "express" : "standard"})</span>
          <strong>{shipping === 0 ? "Free" : formatBDT(shipping)}</strong>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <strong>{formatBDT(total)}</strong>
        </div>
        <p className="summary-note">
          <ShieldCheck size={14} /> Secure, encrypted payment. You'll get an SMS confirmation.
        </p>
        <div className="summary-payments">
          <span>We accept</span>
          <div>
            <span>bKash</span>
            <span>Nagad</span>
            <span>VISA</span>
            <span>Mastercard</span>
            <span>COD</span>
          </div>
        </div>
        <div className="checkout-help">
          <p>Questions before ordering?</p>
          <a href="tel:+8809612345678">+880 9612 345 678</a>
          <span>Every day, 9am–9pm · Dhaka time</span>
        </div>
      </aside>
    ),
    [cartLines, cartCount, subtotal, discount, coupon, delivery, shipping, total, couponError, couponCode]
  );

  if (cartLines.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-empty">
            <span className="cart-empty__icon">
              <ShoppingBag size={34} />
            </span>
            <span className="eyebrow">Checkout</span>
            <h1>Your cart is empty.</h1>
            <p>Add something lovely first — then we'll get it on its way.</p>
            <Link className="btn btn--primary" to="/shop">
              Browse the shop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/cart">Cart</Link>
          <ChevronRight size={13} />
          <span>Checkout</span>
        </nav>

        <header className="checkout-head">
          <div>
            <span className="eyebrow">
              <LockKeyhole size={14} /> Secure checkout
            </span>
            <h1>Almost yours.</h1>
            <p>Three quick steps. No surprises at the end.</p>
          </div>
          <Link className="text-link" to="/cart">
            <ArrowLeft size={15} /> Back to cart
          </Link>
        </header>

        <div className="checkout-steps" aria-label="Checkout progress">
          {steps.map((item) => (
            <button
              type="button"
              key={item.key}
              className={`checkout-step ${step === item.key ? "is-active" : ""} ${step > item.key ? "is-done" : ""}`}
              onClick={() => {
                if (item.key < step) setStep(item.key);
              }}
              disabled={item.key > step}
              aria-current={step === item.key ? "step" : undefined}
            >
              <span className="checkout-step__num">{step > item.key ? <Check size={15} /> : item.key}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 && (
              <section className="checkout-card" aria-labelledby="delivery-heading">
                <div className="checkout-card__head">
                  <span className="checkout-card__icon">
                    <MapPin size={19} />
                  </span>
                  <div>
                    <h2 id="delivery-heading">Where should we send it?</h2>
                    <p>We'll only use these details for your order.</p>
                  </div>
                  <button type="button" className="text-button text-button--sm checkout-sample" onClick={fillSample}>
                    Use sample details
                  </button>
                </div>

                <div className="form-grid">
                  <Field label="Full name" error={errors.name}>
                    <input
                      type="text"
                      value={address.name}
                      onChange={(event) => update("name", event.target.value)}
                      placeholder="e.g. Nusrat Jahan"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Mobile number" error={errors.phone} hint="For delivery updates and calls.">
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(event) => update("phone", event.target.value)}
                      placeholder="01712 345678"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </Field>
                  <Field label="Email address" error={errors.email} hint="Your receipt and tracking link go here.">
                    <input
                      type="email"
                      value={address.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Street address" error={errors.street}>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(event) => update("street", event.target.value)}
                      placeholder="House / flat, road"
                      autoComplete="address-line1"
                    />
                  </Field>
                  <Field label="Apartment, floor, landmark" optional>
                    <input
                      type="text"
                      value={address.apartment}
                      onChange={(event) => update("apartment", event.target.value)}
                      placeholder="e.g. Apt 4B, next to the pharmacy"
                      autoComplete="address-line2"
                    />
                  </Field>
                  <Field label="City" error={errors.city}>
                    <select value={address.city} onChange={(event) => update("city", event.target.value)}>
                      {cityOptions.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Area / thana" error={errors.area}>
                    <input
                      type="text"
                      value={address.area}
                      onChange={(event) => update("area", event.target.value)}
                      placeholder="e.g. Dhanmondi"
                      autoComplete="address-level2"
                    />
                  </Field>
                  <Field label="Postcode" optional>
                    <input
                      type="text"
                      value={address.postcode}
                      onChange={(event) => update("postcode", event.target.value)}
                      placeholder="e.g. 1209"
                      autoComplete="postal-code"
                    />
                  </Field>
                </div>

                <div className="delivery-options">
                  <h3>Delivery speed</h3>
                  <label className={`delivery-option ${delivery === "standard" ? "is-active" : ""}`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={delivery === "standard"}
                      onChange={() => setDelivery("standard")}
                    />
                    <span className="delivery-option__icon">
                      <Truck size={20} />
                    </span>
                    <span>
                      <strong>Standard delivery</strong>
                      <small>
                        {address.city === "Dhaka" ? "1–2 working days" : "2–4 working days"} · tracked
                      </small>
                    </span>
                    <strong>{standardShipping(subtotal) === 0 ? "Free" : formatBDT(standardShipping(subtotal))}</strong>
                  </label>
                  <label className={`delivery-option ${delivery === "express" ? "is-active" : ""}`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={delivery === "express"}
                      onChange={() => setDelivery("express")}
                    />
                    <span className="delivery-option__icon">
                      <Sparkles size={20} />
                    </span>
                    <span>
                      <strong>Express delivery</strong>
                      <small>
                        {address.city === "Dhaka" ? "Same-day if ordered before 12pm" : "Next working day where available"}
                      </small>
                    </span>
                    <strong>{formatBDT(EXPRESS_SHIPPING)}</strong>
                  </label>
                </div>

                <Field label="Delivery note or gift message" optional>
                  <textarea
                    rows="3"
                    value={address.notes}
                    onChange={(event) => update("notes", event.target.value)}
                    placeholder="Gate code, preferred time, or a little note for the recipient…"
                  />
                </Field>

                <div className="checkout-card__foot">
                  <span className="checkout-card__secure">
                    <LockKeyhole size={14} /> Your details are encrypted and never shared.
                  </span>
                  <button type="button" className="btn btn--primary" onClick={nextStep}>
                    Continue to payment <ArrowRight size={16} />
                  </button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="checkout-card" aria-labelledby="payment-heading">
                <div className="checkout-card__head">
                  <span className="checkout-card__icon">
                    <Wallet size={19} />
                  </span>
                  <div>
                    <h2 id="payment-heading">How would you like to pay?</h2>
                    <p>All online payments are encrypted and processed securely.</p>
                  </div>
                </div>

                <div className="payment-options">
                  {[
                    { key: "bkash", icon: Smartphone, title: "bKash", copy: "Pay from your bKash wallet" },
                    { key: "nagad", icon: Smartphone, title: "Nagad", copy: "Pay from your Nagad wallet" },
                    { key: "card", icon: CreditCard, title: "Credit / debit card", copy: "Visa, Mastercard, Amex" },
                    { key: "cod", icon: Banknote, title: "Cash on delivery", copy: "Pay when it arrives (up to ৳10,000)" },
                  ].map(({ key, icon: Icon, title, copy }) => (
                    <label className={`payment-option ${payment === key ? "is-active" : ""}`} key={key}>
                      <input
                        type="radio"
                        name="payment"
                        value={key}
                        checked={payment === key}
                        onChange={() => {
                          setPayment(key);
                          setErrors({});
                        }}
                      />
                      <span className="payment-option__icon">
                        <Icon size={21} />
                      </span>
                      <span>
                        <strong>{title}</strong>
                        <small>{copy}</small>
                      </span>
                      <span className="payment-option__radio" aria-hidden="true" />
                    </label>
                  ))}
                </div>

                {(payment === "bkash" || payment === "nagad") && (
                  <div className="payment-panel">
                    <div className="payment-panel__brand">{payment === "bkash" ? "bKash" : "Nagad"}</div>
                    <Field
                      label={`${payment === "bkash" ? "bKash" : "Nagad"} account number`}
                      error={errors.wallet}
                      hint="You'll receive a payment request after placing the order."
                    >
                      <input
                        type="tel"
                        inputMode="tel"
                        value={paymentDetails.wallet}
                        onChange={(event) => {
                          setPaymentDetails({ ...paymentDetails, wallet: event.target.value });
                          setErrors({ ...errors, wallet: undefined });
                        }}
                        placeholder="01XXXXXXXXX"
                      />
                    </Field>
                    <p className="payment-panel__note">
                      <ShieldCheck size={15} /> A secure payment request will be sent to this number.
                      Your order is held for 30 minutes.
                    </p>
                  </div>
                )}

                {payment === "card" && (
                  <div className="payment-panel">
                    <div className="payment-panel__brand payment-panel__brand--card">
                      <CreditCard size={18} /> Secure card payment
                    </div>
                    <Field label="Card number" error={errors.card}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={paymentDetails.card}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                          setPaymentDetails({
                            ...paymentDetails,
                            card: digits.replace(/(.{4})/g, "$1 ").trim(),
                          });
                          setErrors({ ...errors, card: undefined });
                        }}
                        placeholder="4242 4242 4242 4242"
                        autoComplete="cc-number"
                      />
                    </Field>
                    <div className="form-grid">
                      <Field label="Expiry" error={errors.expiry}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={paymentDetails.expiry}
                          onChange={(event) => {
                            let value = event.target.value.replace(/\D/g, "").slice(0, 4);
                            if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
                            setPaymentDetails({ ...paymentDetails, expiry: value });
                            setErrors({ ...errors, expiry: undefined });
                          }}
                          placeholder="MM/YY"
                          autoComplete="cc-exp"
                        />
                      </Field>
                      <Field label="CVC" error={errors.cvc}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={paymentDetails.cvc}
                          onChange={(event) => {
                            setPaymentDetails({
                              ...paymentDetails,
                              cvc: event.target.value.replace(/\D/g, "").slice(0, 4),
                            });
                            setErrors({ ...errors, cvc: undefined });
                          }}
                          placeholder="123"
                          autoComplete="cc-csc"
                        />
                      </Field>
                    </div>
                    <p className="payment-panel__note">
                      <LockKeyhole size={15} /> This is a demo checkout — no real card details are
                      charged or stored.
                    </p>
                  </div>
                )}

                {payment === "cod" && (
                  <div className="payment-panel payment-panel--cod">
                    <Banknote size={22} />
                    <div>
                      <strong>Pay when your order arrives.</strong>
                      <p>
                        Cash on delivery is available on orders up to ৳10,000. You can inspect the
                        packaging before paying. A ৳20 handling fee may apply in some areas.
                      </p>
                    </div>
                  </div>
                )}

                <div className="checkout-card__foot">
                  <button type="button" className="btn btn--ghost" onClick={backStep}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="button" className="btn btn--primary" onClick={nextStep}>
                    Review your order <ArrowRight size={16} />
                  </button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="checkout-card" aria-labelledby="review-heading">
                <div className="checkout-card__head">
                  <span className="checkout-card__icon">
                    <Package size={19} />
                  </span>
                  <div>
                    <h2 id="review-heading">One last look</h2>
                    <p>Check everything over — you can still edit any step.</p>
                  </div>
                </div>

                <div className="review-blocks">
                  <div className="review-block">
                    <div className="review-block__head">
                      <span>
                        <MapPin size={16} /> Delivery to
                      </span>
                      <button type="button" onClick={() => setStep(1)}>
                        Edit
                      </button>
                    </div>
                    <strong>
                      {address.name} · {address.phone}
                    </strong>
                    <p>
                      {address.apartment && `${address.apartment}, `}
                      {address.street}, {address.area}, {address.city}
                      {address.postcode ? ` ${address.postcode}` : ""}
                    </p>
                    <small>{address.email}</small>
                    {address.notes && <small className="review-block__note">Note: “{address.notes}”</small>}
                  </div>
                  <div className="review-block">
                    <div className="review-block__head">
                      <span>
                        <Truck size={16} /> Delivery & payment
                      </span>
                      <button type="button" onClick={() => setStep(2)}>
                        Edit
                      </button>
                    </div>
                    <strong>{delivery === "express" ? "Express delivery" : "Standard delivery"}</strong>
                    <p>
                      {shipping === 0 ? "Free delivery" : formatBDT(shipping)} ·{" "}
                      {address.city === "Dhaka" ? "1–2 working days" : "2–4 working days"}
                    </p>
                    <small>Paying with: {paymentLabel}</small>
                  </div>
                </div>

                <div className="review-items">
                  {cartLines.map((line) => (
                    <div className="review-item" key={line.key}>
                      <img src={line.product.images[0]} alt="" />
                      <div>
                        <strong>{line.product.name}</strong>
                        <small>
                          {[line.options.color, line.options.size && `Size ${line.options.size}`]
                            .filter(Boolean)
                            .join(" · ")}{" "}
                          · Qty {line.qty}
                        </small>
                      </div>
                      <span>{formatBDT(line.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                <label className="terms-check">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(event) => {
                      setTerms(event.target.checked);
                      setErrors({ ...errors, terms: undefined });
                    }}
                  />
                  <span>
                    I agree to ShopBondhu's <a href="#terms">terms of service</a> and{" "}
                    <a href="#returns">returns policy</a>, and confirm my delivery details are
                    correct.
                  </span>
                </label>
                {errors.terms && (
                  <p className="form-error" role="alert">
                    {errors.terms}
                  </p>
                )}

                <div className="checkout-card__foot">
                  <button type="button" className="btn btn--ghost" onClick={backStep}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--place"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? (
                      <>
                        <span className="spinner" /> Placing your order…
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={16} /> Place order · {formatBDT(total)}
                      </>
                    )}
                  </button>
                </div>
                <p className="checkout-terms">
                  By placing this order you agree to our returns and privacy policies. This is a demo
                  store — no payment will be taken.
                </p>
              </section>
            )}

            <div className="checkout-trust">
              <span>
                <ShieldCheck size={18} /> 100% authentic products
              </span>
              <span>
                <Truck size={18} /> Tracked delivery
              </span>
              <span>
                <Gift size={18} /> Free gift wrap
              </span>
              <span>
                <LockKeyhole size={18} /> Secure payments
              </span>
            </div>
          </div>

          {summary}
        </div>
      </div>
    </div>
  );
}
