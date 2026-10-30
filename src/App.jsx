import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { StoreProvider } from "./store/StoreContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Track from "./pages/Track";
import Account from "./pages/Account";
import Support from "./pages/Support";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderSuccess />} />
            <Route path="track" element={<Track />} />
            <Route path="account" element={<Account />} />
            <Route path="support" element={<Support />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
