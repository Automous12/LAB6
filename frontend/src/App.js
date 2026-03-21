import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import ProductList   from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart          from "./components/Cart";
import Checkout      from "./components/Checkout";

function Header() {
  const { totalItems } = useCart();
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">LUXE<span>Shop</span></Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-cart">
            🛒 Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/"            element={<ProductList />}   />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart"        element={<Cart />}          />
            <Route path="/checkout"    element={<Checkout />}      />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;