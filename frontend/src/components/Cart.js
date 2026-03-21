import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  if (cart.length === 0)
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p style={{ marginBottom: 32 }}>Add some products to get started</p>
        <Link to="/">
          <button className="btn btn-primary btn-lg">Continue Shopping</button>
        </Link>
      </div>
    );

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-subtitle">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item._id}>
              {/* Image */}
              <div className="cart-item-img">
                <img src={item.image} alt={item.title} />
              </div>

              {/* Info */}
              <div>
                <div className="cart-item-title">{item.title}</div>
                <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => item.quantity > 1
                      ? updateQuantity(item._id, item.quantity - 1)
                      : removeFromCart(item._id)
                    }
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span style={{ color: "var(--muted)", fontSize: 13, marginLeft: 4 }}>
                    × ${item.price?.toFixed(2)} each
                  </span>
                </div>
              </div>

              {/* Remove */}
              <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>
                Remove
              </button>
            </div>
          ))}

          <button
            className="btn btn-outline btn-sm"
            style={{ alignSelf: "flex-start" }}
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          {cart.map((item) => (
            <div className="summary-row" key={item._id}>
              <span>{item.title.slice(0, 22)}… ×{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="summary-row" style={{ marginTop: 8 }}>
            <span>Shipping</span>
            <span style={{ color: "var(--success)" }}>Free</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span style={{ color: "var(--accent)" }}>${totalPrice.toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="btn btn-primary btn-lg" style={{ width: "100%" }}>
              Proceed to Checkout →
            </button>
          </Link>

          <Link to="/">
            <button className="btn btn-outline" style={{ width: "100%", marginTop: 12 }}>
              ← Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;