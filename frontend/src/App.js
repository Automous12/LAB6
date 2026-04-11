import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { CartProvider, useCart }  from "./context/CartContext";
import { AuthProvider, useAuth }  from "./context/AuthContext";
import ProductList   from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart          from "./components/Cart";
import Checkout      from "./components/Checkout";
import AdminPanel    from "./pages/AdminPanel";
import AuthModal     from "./components/AuthModal";

function Header({ onShowAuth }) {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">LUXE<span>Shop</span></Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>+91 {user.phone}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={onShowAuth}>Login</button>
          )}

          <Link to="/cart" className="nav-cart">
            🛒 Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function AppInner() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Header onShowAuth={() => setShowAuth(true)} />
      <div className="container">
        <Routes>
          <Route path="/"            element={<ProductList />}   />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart"        element={<Cart />}          />
          <Route path="/checkout"    element={<Checkout />}      />
          <Route path="/admin"       element={<AdminPanel />}    />
          <Route path="*"            element={<Navigate to="/" />} />
        </Routes>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;