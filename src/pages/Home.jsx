import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Leaf,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { categories, categoryCount, products, testimonials } from "../data/products";
import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";
import RatingStars from "../components/RatingStars";
import SectionHeading from "../components/SectionHeading";
import SearchBox from "../components/SearchBox";
import Reveal from "../components/Reveal";
import TrustStrip from "../components/TrustStrip";
import Newsletter from "../components/Newsletter";

function useCountdown() {
  const target = useMemo(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return end.getTime();
  }, []);
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const timer = window.setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => window.clearInterval(timer);
  }, [target]);
  const total = Math.floor(left / 1000);
  return {
    hours: String(Math.floor(total / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
    seconds: String(total % 60).padStart(2, "0"),
  };
}

export default function Home() {
  const { wishlist } = useStore();
  const countdown = useCountdown();
  const deals = products.filter((product) => product.deal).slice(0, 4);
  const bestsellers = products.filter((product) => product.badge === "Bestseller").slice(0, 4);
  const newArrivals = products.filter((product) => product.badge === "New").slice(0, 4);

  return (
    <>
      <section className="hero">
        <span className="hero__wash" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <Reveal>
              <span className="hero__eyebrow">
                <span className="hero__eyebrow-dot" /> Honestly chosen. Happily delivered.
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h1>
                Good things,
                <br />
                from a <em>bondhu</em>
                <br />
                you can trust.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="hero__lede">
                Thoughtful everyday finds, honest prices and stock you can count on — picked by real
                people, delivered to your door across Bangladesh.
              </p>
            </Reveal>
            <Reveal delay={180} className="hero__search-wrap">
              <SearchBox variant="hero" placeholder="What can we find for you today?" />
              <div className="hero__popular">
                <span>Popular:</span>
                {[
                  ["Headphones", "headphones"],
                  ["Mugs", "mug"],
                  ["Skincare", "skincare"],
                  ["Tote bags", "tote"],
                ].map(([label, query]) => (
                  <Link key={label} to={`/shop?q=${query}`}>
                    {label}
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal delay={240} className="hero__proof">
              <div className="avatar-stack" aria-hidden="true">
                <span style={{ background: "#DCE9E3" }}>NJ</span>
                <span style={{ background: "#F2E4D4" }}>TA</span>
                <span style={{ background: "#F3DFDD" }}>FR</span>
                <span style={{ background: "#E3E1EC" }}>RI</span>
                <span className="avatar-stack__more">+</span>
              </div>
              <div className="hero__proof-copy">
                <span className="hero__proof-stars">
                  <Star size={14} fill="currentColor" /> 4.9 from 2,800+ reviews
                </span>
                <span>Trusted by 12,400+ shoppers across Bangladesh</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="hero__visual">
            <div className="hero__image-wrap">
              <img
                src="/images/hero.webp"
                alt="A shopper browsing thoughtfully chosen clothing at ShopBondhu"
                width="1400"
                height="1000"
              />
              <span className="hero__image-tag">
                <Sparkles size={14} /> The everyday edit
              </span>
            </div>
            <div className="hero__float hero__float--delivery">
              <span className="hero__float-icon">
                <Truck size={20} />
              </span>
              <span>
                <strong>Free delivery</strong>
                <small>on orders over ৳1,500</small>
              </span>
            </div>
            <div className="hero__float hero__float--rating">
              <span className="hero__float-score">4.9</span>
              <span>
                <span className="hero__mini-stars">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </span>
                <small>“Felt like a friend picked it.”</small>
              </span>
            </div>
            <div className="hero__sticker" aria-hidden="true">
              <span>New here?</span>
              <strong>10% off</strong>
              <small>with BONDHU10</small>
            </div>
            <svg className="hero__squiggle" viewBox="0 0 120 50" fill="none" aria-hidden="true">
              <path
                d="M4 38c14-26 31-26 43-8s25 18 37-6 22-18 30-6"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </Reveal>
        </div>
      </section>

      <TrustStrip />

      <section className="section categories-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Start here"
              title="Find your kind of good"
              copy="Six little corners of the shop, each curated with the same rule: only things we'd use ourselves."
              link="/shop"
              linkLabel="Shop everything"
            />
          </Reveal>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 50}>
                <Link to={`/shop?category=${category.slug}`} className="category-card">
                  <span className="category-card__media" style={{ background: category.accent }}>
                    <img src={category.image} alt="" loading="lazy" />
                    <span className="category-card__arrow">
                      <ArrowRight size={17} />
                    </span>
                  </span>
                  <span className="category-card__copy">
                    <strong>{category.name}</strong>
                    <small>{categoryCount(category.slug)} products</small>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section deals-section">
        <div className="container">
          <div className="deals-panel">
            <Reveal className="deals-panel__head">
              <div>
                <span className="eyebrow">
                  <Tag size={14} /> Today's deals
                </span>
                <h2>Good prices. No funny business.</h2>
                <p>
                  Real reductions on things we actually stock — not inflated “was” prices. When the
                  timer ends, so does the deal.
                </p>
              </div>
              <div className="deals-panel__timer">
                <span className="deals-panel__timer-label">
                  <Clock3 size={14} /> Ends tonight
                </span>
                <div className="countdown" aria-label={`Deal ends in ${countdown.hours} hours ${countdown.minutes} minutes`}>
                  <div>
                    <strong>{countdown.hours}</strong>
                    <small>hrs</small>
                  </div>
                  <span>:</span>
                  <div>
                    <strong>{countdown.minutes}</strong>
                    <small>min</small>
                  </div>
                  <span>:</span>
                  <div>
                    <strong>{countdown.seconds}</strong>
                    <small>sec</small>
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="product-grid product-grid--4">
              {deals.map((product, index) => (
                <Reveal key={product.id} delay={index * 60}>
                  <ProductCard product={product} index={index} />
                </Reveal>
              ))}
            </div>
            <Reveal className="deals-panel__foot">
              <span>
                <ShieldCheck size={16} /> Every deal includes our 7-day easy return promise.
              </span>
              <Link className="text-link" to="/shop?filter=deals">
                See all deals <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bestsellers-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Loved by many"
              title="The bestsellers, honestly"
              copy="The things our customers keep coming back for — and telling their friends about."
              link="/shop?filter=bestsellers"
              linkLabel="Shop bestsellers"
            />
          </Reveal>
          <div className="product-grid product-grid--4">
            {bestsellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section editorial-section">
        <div className="container">
          <div className="editorial">
            <Reveal className="editorial__media">
              <img
                src="/images/story.webp"
                alt="A ShopBondhu team member carefully packing an order"
                loading="lazy"
              />
              <span className="editorial__media-card">
                <HeartHandshake size={20} />
                <span>
                  <strong>Packed by people, not robots.</strong>
                  <small>Every order checked twice before it leaves us.</small>
                </span>
              </span>
            </Reveal>
            <Reveal delay={100} className="editorial__copy">
              <span className="eyebrow eyebrow--light">Just landed</span>
              <h2>New season. Same promise.</h2>
              <p>
                We add a small handful of new things each week — never a hundred. Each one is tried,
                compared and chosen because it solves something real in everyday life.
              </p>
              <ul className="editorial__list">
                <li>
                  <BadgeCheck size={18} />
                  <span>
                    <strong>Checked by a real person</strong>
                    <small>Quality, packaging and completeness — every single order.</small>
                  </span>
                </li>
                <li>
                  <Leaf size={18} />
                  <span>
                    <strong>Less waste, more thought</strong>
                    <small>Recycled boxes, paper tape and no unnecessary plastic.</small>
                  </span>
                </li>
                <li>
                  <Users size={18} />
                  <span>
                    <strong>Support that knows the products</strong>
                    <small>A small Dhaka team, available 9am–9pm, every day.</small>
                  </span>
                </li>
              </ul>
              <div className="editorial__actions">
                <Link className="btn btn--accent" to="/shop?filter=new">
                  Shop new arrivals <ArrowRight size={16} />
                </Link>
                <Link className="btn btn--ghost-light" to="/support#about">
                  Our story
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section new-section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Fresh this week"
              title="Just landed"
              copy="Small, considered additions to the shop. Here's what's new."
              link="/shop?filter=new"
              linkLabel="View new in"
            />
          </Reveal>
          <div className="product-grid product-grid--4">
            {newArrivals.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <Reveal className="reviews-head">
            <div>
              <span className="eyebrow">
                <Star size={14} /> Real reviews, real people
              </span>
              <h2>12,400 shoppers. A lot of happy postage.</h2>
              <p>
                We publish every review — the glowing ones and the honest ones. Here's what people
                are saying this month.
              </p>
            </div>
            <div className="reviews-score">
              <strong>4.9</strong>
              <div>
                <RatingStars rating={4.9} size={16} />
                <span>Average from 2,843 verified reviews</span>
              </div>
            </div>
          </Reveal>

          <div className="reviews-grid">
            {testimonials.map((review, index) => (
              <Reveal key={review.name} delay={index * 60}>
                <article className="review-card">
                  <div className="review-card__top">
                    <RatingStars rating={review.rating} size={14} />
                    <Quote size={22} className="review-card__quote" />
                  </div>
                  <h3>{review.title}</h3>
                  <p>“{review.quote}”</p>
                  <div className="review-card__person">
                    <span className="review-card__avatar" style={{ background: review.tone }}>
                      {review.initials}
                    </span>
                    <span>
                      <strong>{review.name}</strong>
                      <small>
                        {review.location} · Verified buyer
                      </small>
                    </span>
                  </div>
                  <Link to={`/shop?q=${encodeURIComponent(review.product.split(" ")[0])}`} className="review-card__product">
                    Bought: {review.product} <ChevronRight size={13} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="reviews-foot">
            <span>
              <BadgeCheck size={17} /> Only verified purchases can leave a review. No paid placements.
            </span>
            <Link className="text-link" to="/shop">
              Find your next favourite <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section promise-section">
        <div className="container">
          <Reveal className="promise-head">
            <span className="eyebrow">The ShopBondhu promise</span>
            <h2>Why people call us a bondhu</h2>
          </Reveal>
          <div className="promise-grid">
            {[
              {
                icon: ShieldCheck,
                title: "Honest, always",
                copy: "Real stock counts, real prices, real reviews. If we wouldn't buy it ourselves, it doesn't go in the shop.",
              },
              {
                icon: HeartHandshake,
                title: "Human help",
                copy: "Message us and you'll reach a person in Dhaka — not a bot loop. We answer in minutes, not days.",
              },
              {
                icon: Truck,
                title: "Delivery you can plan around",
                copy: "Tracked nationwide delivery, careful packaging, and a heads-up call before your parcel arrives.",
              },
            ].map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 70}>
                <div className="promise-card">
                  <span className="promise-card__icon">
                    <Icon size={23} />
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <span className="promise-card__num">0{index + 1}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <section className="section help-band">
        <div className="container help-band__inner">
          <div>
            <span className="eyebrow">Need a hand?</span>
            <h2>We're right here.</h2>
            <p>Questions about a product, an order or a return? A real human is ready to help.</p>
          </div>
          <div className="help-band__actions">
            <Link className="btn btn--primary" to="/support">
              Visit customer support <ArrowRight size={16} />
            </Link>
            <Link className="btn btn--ghost" to="/track">
              Track an order
            </Link>
          </div>
        </div>
      </section>

      {wishlist.length > 0 && (
        <div className="wishlist-nudge container">
          <HeartHandshake size={18} />
          <span>
            You have {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"} waiting.
          </span>
          <Link to="/wishlist">
            View wishlist <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </>
  );
}
