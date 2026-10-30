import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { categories } from "../data/products";
import Logo from "./Logo";

const payments = ["bKash", "Nagad", "VISA", "Mastercard", "Amex", "Cash on delivery"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="light" />
            <p className="footer__tagline">
              আপনার প্রতিদিনের বিশ্বস্ত বন্ধু — your everyday friend for good things, honestly
              chosen.
            </p>
            <div className="footer__contact">
              <a href="tel:+8809612345678">
                <Phone size={15} /> +880 9612 345 678
              </a>
              <a href="mailto:hello@shopbondhu.com">
                <Mail size={15} /> hello@shopbondhu.com
              </a>
              <span>
                <MapPin size={15} /> House 42, Road 11, Banani, Dhaka 1213
              </span>
              <span>
                <Clock size={15} /> Every day, 9:00 am – 9:00 pm
              </span>
            </div>
            <div className="footer__social">
              <a href="#instagram" aria-label="ShopBondhu on Instagram">
                <Instagram size={18} />
              </a>
              <a href="#facebook" aria-label="ShopBondhu on Facebook">
                <Facebook size={18} />
              </a>
              <a href="#youtube" aria-label="ShopBondhu on YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h3>Shop</h3>
            <Link to="/shop">All products</Link>
            {categories.map((category) => (
              <Link key={category.slug} to={`/shop?category=${category.slug}`}>
                {category.name}
              </Link>
            ))}
            <Link to="/shop?filter=deals">Today's deals</Link>
          </div>

          <div className="footer__col">
            <h3>Your order</h3>
            <Link to="/cart">Shopping cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/track">Track an order</Link>
            <Link to="/account">My account</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/support">Returns & exchanges</Link>
          </div>

          <div className="footer__col">
            <h3>We're here to help</h3>
            <Link to="/support">Customer support</Link>
            <Link to="/support#faq">FAQs</Link>
            <Link to="/support#contact">Contact us</Link>
            <Link to="/support#delivery">Delivery info</Link>
            <Link to="/support#returns">Return policy</Link>
            <Link to="/account">Order history</Link>
          </div>

          <div className="footer__col footer__col--story">
            <h3>Our promise</h3>
            <p>
              We're a small, independent team in Dhaka. Every product is checked by a real person
              before it ships — and if something isn't right, we fix it.
            </p>
            <Link className="footer__promise-link" to="/support#about">
              Read our story <ArrowUpRight size={15} />
            </Link>
            <div className="footer__badge">
              <span>★ 4.9 / 5</span>
              <small>from 12,400+ happy shoppers</small>
            </div>
          </div>
        </div>

        <div className="footer__payments">
          <span className="footer__payments-label">Safe & simple payments</span>
          <div className="footer__payment-row">
            {payments.map((payment) => (
              <span key={payment}>{payment}</span>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 ShopBondhu Ltd. All rights reserved.</p>
          <div>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#accessibility">Accessibility</a>
          </div>
          <p className="footer__made">Made with care in Dhaka, Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
