import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart }  from "../context/CartContext";
import { useAuth }  from "../context/AuthContext";
import { createOrder } from "../services/api";
import SlowPay   from "./SlowPay";
import AuthModal from "./AuthModal";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [showSlowPay,  setShowSlowPay]  = useState(false);
  const [showAuth,     setShowAuth]     = useState(false);
  const [orderId,      setOrderId]      = useState(null);

  const handleOrderCreated = async (shipping) => {
    const res = await createOrder({
      ...shipping,
      items: cart.map((i) => ({
        productId: i._id,
        title:     i.title,
        price:     i.price,
        quantity:  i.quantity,
        image:     i.image,
      })),
      total: totalPrice,
    });
    setOrderId(res.data.orderId);
    clearCart();
  };

  const handlePaymentSuccess = () => {
    setShowSlowPay(false);
    // orderId is already set — the success screen below will render
  };

  /* ── Empty guard ── */
  if (cart.length === 0 && !orderId)
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h3>Nothing to checkout</h3>
        <Link to="/"><button className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Shop Now</button></Link>
      </div>
    );

  /* ── Order confirmed screen ── */
  if (orderId)
    return (
      <div className="checkout-page">
        <div className="form-card success-card">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Order Confirmed!</h2>
          <p className="success-sub">
            Order ID: <strong style={{ color: "var(--accent)" }}>
              #{orderId.toString().slice(-8).toUpperCase()}
            </strong>
          </p>

          {!user && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>
                Login to track this order anytime
              </p>
              <button className="btn btn-outline btn-lg" onClick={() => setShowAuth(true)}>
                Login to Track Order
              </button>
            </div>
          )}

          <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>

        {showAuth && (
          <AuthModal
            message="Login to track your order"
            onClose={() => { setShowAuth(false); navigate("/"); }}
            onSuccess={() => navigate("/")}
          />
        )}
      </div>
    );

  /* ── Main checkout page ── */
  return (
    <div className="checkout-page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Review your order then pay via SlowPay</p>

      <div className="form-card">
        {/* Order summary */}
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

        {/* Info banner */}
        <div className="sp-info-banner">
          💳 Shipping &amp; card details are pre-filled on the next screen for this demo.
          No real payment is taken.
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ width: "100%" }}
          onClick={() => setShowSlowPay(true)}
        >
          Pay with SlowPay · ${totalPrice.toFixed(2)}
        </button>

        <Link to="/cart">
          <button className="btn btn-outline" style={{ width: "100%", marginTop: 12 }}>
            ← Back to Cart
          </button>
        </Link>
      </div>

      {showSlowPay && (
        <SlowPay
          total={totalPrice}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowSlowPay(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
}

export default Checkout;