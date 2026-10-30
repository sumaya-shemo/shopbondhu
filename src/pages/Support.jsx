import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  HeartHandshake,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { faqs } from "../data/products";
import { useStore } from "../store/StoreContext";
import Reveal from "../components/Reveal";

const groups = ["Orders & delivery", "Returns & exchanges", "Payments & security", "Products & stock"];

const deliveryRows = [
  ["Dhaka Metro", "1–2 working days", "Free over ৳1,500 · otherwise ৳70"],
  ["Chattogram, Sylhet, Khulna, Rajshahi", "2–4 working days", "Free over ৳1,500 · otherwise ৳70"],
  ["Barishal, Rangpur, Mymensingh & elsewhere", "3–5 working days", "Free over ৳1,500 · otherwise ৳70"],
  ["Express (Dhaka, order before 12pm)", "Same day", "৳120"],
];

export default function Support() {
  const { addToast } = useStore();
  const [faqSearch, setFaqSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("Orders & delivery");
  const [openFaq, setOpenFaq] = useState(faqs[0].q);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Order help",
    order: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const visibleFaqs = useMemo(() => {
    const term = faqSearch.trim().toLowerCase();
    if (term) {
      return faqs.filter((faq) =>
        `${faq.q} ${faq.a} ${faq.group}`.toLowerCase().includes(term)
      );
    }
    return faqs.filter((faq) => faq.group === activeGroup);
  }, [faqSearch, activeGroup]);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "A little more detail would help us help you.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    addToast("Message sent — we'll reply within one working day.");
    setForm({ name: "", email: "", topic: "Order help", order: "", message: "" });
  };

  const searchFaq = (event) => {
    event.preventDefault();
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="support-page">
      <section className="support-hero">
        <div className="container support-hero__inner">
          <div>
            <span className="eyebrow">
              <Headphones size={14} /> Customer support
            </span>
            <h1>How can we help, bondhu?</h1>
            <p>
              Real people, in Dhaka, ready to sort things out. Search the answers below or reach us
              directly — no bots, no endless menus.
            </p>
            <form className="support-search" onSubmit={searchFaq}>
              <Search size={19} />
              <input
                type="search"
                value={faqSearch}
                onChange={(event) => setFaqSearch(event.target.value)}
                placeholder="Search help topics, e.g. “return” or “delivery”"
                aria-label="Search help topics"
              />
              <button type="submit">Search help</button>
            </form>
            <div className="support-hero__hours">
              <Clock size={15} /> Open every day, 9:00 am – 9:00 pm (Dhaka time)
            </div>
          </div>
          <div className="support-hero__art" aria-hidden="true">
            <div className="support-bubble support-bubble--one">
              <MessageCircle size={22} />
              <span>
                <strong>Hi! How can we help?</strong>
                <small>Typical reply: 4 min</small>
              </span>
            </div>
            <div className="support-bubble support-bubble--two">
              <BadgeCheck size={18} />
              <span>Order SB-2026-1042 is on its way</span>
            </div>
            <div className="support-bubble support-bubble--three">
              <HeartHandshake size={18} /> A real human, every time.
            </div>
            <span className="support-hero__ring" />
          </div>
        </div>
      </section>

      <section className="section support-channels">
        <div className="container">
          <div className="support-channels__grid">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp us",
                copy: "Fastest for order updates and product questions.",
                action: "Chat on WhatsApp",
                href: "https://wa.me/8809612345678",
                accent: true,
              },
              {
                icon: Phone,
                title: "Call us",
                copy: "Speak to a real person, every day 9am–9pm.",
                action: "+880 9612 345 678",
                href: "tel:+8809612345678",
              },
              {
                icon: Mail,
                title: "Email us",
                copy: "For detailed questions, we reply within a day.",
                action: "hello@shopbondhu.com",
                href: "mailto:hello@shopbondhu.com",
              },
              {
                icon: PackageSearch,
                title: "Track an order",
                copy: "See exactly where your parcel is right now.",
                action: "Open tracking",
                to: "/track",
              },
            ].map(({ icon: Icon, title, copy, action, href, to, accent }) => (
              <div className={`support-channel ${accent ? "support-channel--accent" : ""}`} key={title}>
                <span className="support-channel__icon">
                  <Icon size={21} />
                </span>
                <h2>{title}</h2>
                <p>{copy}</p>
                {to ? (
                  <Link className="text-link" to={to}>
                    {action} <ArrowRight size={14} />
                  </Link>
                ) : (
                  <a className="text-link" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {action} <ArrowRight size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section support-faq" id="faq">
        <div className="container">
          <div className="support-faq__layout">
            <div className="support-faq__intro">
              <span className="eyebrow">Quick answers</span>
              <h2>Frequently asked, honestly answered.</h2>
              <p>
                Most questions are answered here. Can't find yours? Scroll down and send us a
                message — we'll reply like a person, because we are one.
              </p>
              <div className="faq-groups">
                {groups.map((group) => (
                  <button
                    type="button"
                    key={group}
                    className={activeGroup === group && !faqSearch ? "is-active" : ""}
                    onClick={() => {
                      setActiveGroup(group);
                      setFaqSearch("");
                    }}
                  >
                    {group}
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
              <div className="support-faq__help">
                <Headphones size={20} />
                <p>
                  <strong>Still stuck?</strong> Call us at <a href="tel:+8809612345678">+880 9612 345 678</a>
                </p>
              </div>
            </div>

            <div className="support-faq__list">
              {faqSearch && (
                <p className="faq-search-note">
                  {visibleFaqs.length} {visibleFaqs.length === 1 ? "answer" : "answers"} for “
                  {faqSearch}”{" "}
                  <button type="button" onClick={() => setFaqSearch("")}>
                    clear
                  </button>
                </p>
              )}
              {visibleFaqs.length === 0 ? (
                <div className="faq-empty">
                  <Search size={22} />
                  <p>No answers matched that. Try “return”, “delivery” or “payment”.</p>
                </div>
              ) : (
                visibleFaqs.map((faq) => (
                  <div className={`faq-item ${openFaq === faq.q ? "is-open" : ""}`} key={faq.q}>
                    <button
                      type="button"
                      className="faq-item__q"
                      onClick={() => setOpenFaq(openFaq === faq.q ? "" : faq.q)}
                      aria-expanded={openFaq === faq.q}
                    >
                      {faq.q}
                      <ChevronDown size={18} />
                    </button>
                    <div className="faq-item__a">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section support-info" id="delivery">
        <div className="container">
          <div className="support-info__grid">
            <div className="support-info__card">
              <span className="support-info__icon">
                <Truck size={21} />
              </span>
              <h2>Delivery, without the guesswork</h2>
              <p>Tracked delivery across Bangladesh, with an SMS before arrival.</p>
              <div className="delivery-table">
                {deliveryRows.map(([area, time, cost]) => (
                  <div key={area}>
                    <span>{area}</span>
                    <strong>{time}</strong>
                    <small>{cost}</small>
                  </div>
                ))}
              </div>
              <p className="support-info__note">
                Orders placed before 12pm are dispatched the same working day. Friday and public
                holidays may add a day.
              </p>
            </div>

            <div className="support-info__card" id="returns">
              <span className="support-info__icon">
                <RotateCcw size={21} />
              </span>
              <h2>Returns that don't feel like homework</h2>
              <ol className="return-steps">
                <li>
                  <span>1</span>
                  <p>
                    <strong>Tell us within 7 days.</strong> Request a return or exchange from your
                    account, or message us.
                  </p>
                </li>
                <li>
                  <span>2</span>
                  <p>
                    <strong>We arrange the pickup.</strong> Free collection from your door — no
                    courier hunting.
                  </p>
                </li>
                <li>
                  <span>3</span>
                  <p>
                    <strong>Choose your refund.</strong> Original payment method or store credit. Most
                    refunds land within 3–5 working days.
                  </p>
                </li>
              </ol>
              <Link className="text-link" to="/track">
                Find your order <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section support-contact" id="contact">
        <div className="container">
          <div className="support-contact__layout">
            <div className="support-contact__copy">
              <span className="eyebrow">Send us a note</span>
              <h2>Tell us what's up.</h2>
              <p>
                Fill this in and a real person will get back to you within one working day. If it's
                urgent, WhatsApp is fastest.
              </p>
              <div className="support-contact__details">
                <a href="tel:+8809612345678">
                  <Phone size={17} />
                  <span>
                    <strong>+880 9612 345 678</strong>
                    <small>Every day, 9am–9pm</small>
                  </span>
                </a>
                <a href="mailto:hello@shopbondhu.com">
                  <Mail size={17} />
                  <span>
                    <strong>hello@shopbondhu.com</strong>
                    <small>We reply within one working day</small>
                  </span>
                </a>
                <span>
                  <MapPin size={17} />
                  <span>
                    <strong>House 42, Road 11, Banani</strong>
                    <small>Dhaka 1213, Bangladesh</small>
                  </span>
                </span>
              </div>
              <div className="support-contact__promise">
                <HeartHandshake size={20} />
                <p>
                  <strong>Our promise:</strong> no copy-paste replies. If we can't fix it, we'll tell
                  you honestly and find the next best option.
                </p>
              </div>
            </div>

            <div className="support-contact__form">
              {sent ? (
                <div className="support-sent">
                  <span className="support-sent__icon">
                    <Send size={24} />
                  </span>
                  <h3>Message sent. We're on it.</h3>
                  <p>
                    Thanks for getting in touch. We've received your message and will reply within
                    one working day — often much sooner.
                  </p>
                  <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h3>Contact support</h3>
                  <div className="form-grid">
                    <label className={`field ${errors.name ? "has-error" : ""}`}>
                      <span className="field__label">Your name</span>
                      <input
                        value={form.name}
                        onChange={(event) => {
                          setForm({ ...form, name: event.target.value });
                          setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="e.g. Nusrat Jahan"
                      />
                      {errors.name && <span className="field__error">{errors.name}</span>}
                    </label>
                    <label className={`field ${errors.email ? "has-error" : ""}`}>
                      <span className="field__label">Email</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => {
                          setForm({ ...form, email: event.target.value });
                          setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="you@example.com"
                      />
                      {errors.email && <span className="field__error">{errors.email}</span>}
                    </label>
                    <label className="field">
                      <span className="field__label">What's this about?</span>
                      <select
                        value={form.topic}
                        onChange={(event) => setForm({ ...form, topic: event.target.value })}
                      >
                        <option>Order help</option>
                        <option>Return or exchange</option>
                        <option>Product question</option>
                        <option>Payment issue</option>
                        <option>Something else</option>
                      </select>
                    </label>
                    <label className="field">
                      <span className="field__label">
                        Order number <small>Optional</small>
                      </span>
                      <input
                        value={form.order}
                        onChange={(event) => setForm({ ...form, order: event.target.value })}
                        placeholder="e.g. SB-2026-1042"
                      />
                    </label>
                  </div>
                  <label className={`field ${errors.message ? "has-error" : ""}`}>
                    <span className="field__label">How can we help?</span>
                    <textarea
                      rows="5"
                      value={form.message}
                      onChange={(event) => {
                        setForm({ ...form, message: event.target.value });
                        setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Tell us a little about what's going on…"
                    />
                    {errors.message && <span className="field__error">{errors.message}</span>}
                  </label>
                  <div className="support-contact__submit">
                    <button type="submit" className="btn btn--primary">
                      <Send size={16} /> Send message
                    </button>
                    <span>
                      <ShieldCheck size={14} /> Your details stay private.
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section support-story" id="about">
        <div className="container">
          <div className="support-story__inner">
            <Reveal className="support-story__media">
              <img src="/images/story.webp" alt="The ShopBondhu team packing orders in Dhaka" />
            </Reveal>
            <Reveal delay={80} className="support-story__copy">
              <span className="eyebrow eyebrow--light">Our story</span>
              <h2>Built by people who were tired of bad shopping experiences.</h2>
              <p>
                ShopBondhu started in 2024 with a simple frustration: too many online shops showing
                stock they didn't have, prices that weren't real, and support that never answered.
                So we built the shop we wanted to buy from.
              </p>
              <p>
                Today we're a small team in Dhaka, carefully choosing every product and packing every
                order ourselves. “Bondhu” means friend — and that's the standard we hold ourselves to.
              </p>
              <div className="support-story__values">
                <span>
                  <ShieldCheck size={18} />
                  <strong>Honest by default</strong>
                </span>
                <span>
                  <HeartHandshake size={18} />
                  <strong>Human support</strong>
                </span>
                <span>
                  <BadgeCheck size={18} />
                  <strong>Only authentic products</strong>
                </span>
              </div>
              <div className="support-story__payments">
                <CreditCard size={17} />
                <Wallet size={17} />
                <span>Pay with bKash, Nagad, cards or cash</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
