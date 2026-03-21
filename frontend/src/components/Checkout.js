import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error,   setError]   = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const orderData = {
        ...form,
        items: cart.map((i) => ({
          productId: i._id,
          title:     i.title,
          price:     i.price,
          quantity:  i.quantity,
          image:     i.image,
        })),
        total: totalPrice,
      };
      const res = await createOrder(orderData);
      setOrderId(res.data.orderId);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (orderId)
    return (
      <div className="checkout-page">
        <div className="form-card success-card">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-sub">
            Your order has been placed successfully.<br />
            Order ID: <strong style={{ color: "var(--accent)" }}>#{orderId.slice(-8).toUpperCase()}</strong>
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );

  /* ── Empty cart guard ── */
  if (cart.length === 0)
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h3>Nothing to checkout</h3>
        <Link to="/">
          <button className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>
            Shop Now
          </button>
        </Link>
      </div>
    );

  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Almost there — fill in your details</p>

      <div className="form-card">
        <h3 className="form-section-title">Shipping Information</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input
              className="form-input"
              name="address"
              placeholder="123 Main St, City, Country"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Order summary mini */}
          <div className="order-summary-mini">
            <h4 style={{ marginBottom: 12, fontSize: 15 }}>Order Summary</h4>
            {cart.map((item) => (
              <div className="order-line" key={item._id}>
                <span>{item.title.slice(0, 30)}… ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-line" style={{ color: "var(--muted)" }}>
              <span>Shipping</span>
              <span style={{ color: "var(--success)" }}>Free</span>
            </div>
            <div className="order-line total">
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div style={{ color: "var(--danger)", fontSize: 14, marginBottom: 16, padding: "10px 14px", background: "rgba(224,92,110,0.1)", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Placing Order…" : `Place Order · $${totalPrice.toFixed(2)}`}
          </button>

          <Link to="/cart">
            <button type="button" className="btn btn-outline" style={{ width: "100%", marginTop: 12 }}>
              ← Back to Cart
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Checkout;