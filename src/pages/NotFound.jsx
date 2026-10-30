import { Link } from "react-router-dom";
import { ArrowRight, Compass, Home, Search } from "lucide-react";
import SearchBox from "../components/SearchBox";

export default function NotFound() {
  return (
    <div className="notfound container">
      <div className="notfound__art" aria-hidden="true">
        <span className="notfound__bag">
          <Search size={42} />
        </span>
        <span className="notfound__dot notfound__dot--1" />
        <span className="notfound__dot notfound__dot--2" />
        <span className="notfound__squiggle" />
      </div>
      <span className="eyebrow">404 — page not found</span>
      <h1>We looked everywhere for that page.</h1>
      <p>
        It might have moved, sold out, or maybe the link had a typo. Let's get you back to the good
        stuff.
      </p>
      <div className="notfound__search">
        <SearchBox placeholder="Search for something good…" />
      </div>
      <div className="notfound__actions">
        <Link className="btn btn--primary" to="/">
          <Home size={16} /> Back home
        </Link>
        <Link className="btn btn--ghost" to="/shop">
          <Compass size={16} /> Browse the shop
        </Link>
      </div>
    </div>
  );
}
