import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import Header from "./Header";
import Toasts from "./Toasts";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
    </div>
  );
}
