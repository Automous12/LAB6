import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added,   setAdded]   = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((r) => setProduct(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const renderStars = (rate = 0) => {
    const full  = Math.round(rate);
    const empty = 5 - full;
    return "★".repeat(full) + "☆".repeat(empty);
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" /> Loading product…
      </div>
    );

  if (!product)
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🔍</div>
        <h3>Product not found</h3>
        <Link to="/"><button className="btn btn-primary btn-lg" style={{ marginTop: 16 }}>Back to Shop</button></Link>
      </div>
    );

  return (
    <div className="detail-page">
      <Link to="/" style={{ color: "var(--muted)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 32 }}>
        ← Back to Collection
      </Link>

      <div className="detail-grid">
        {/* Image */}
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.title} />
        </div>

        {/* Info */}
        <div className="detail-info">
          <div className="detail-category">{product.category}</div>
          <h1 className="detail-title">{product.title}</h1>

          <div className="detail-rating">
            <span className="stars">{renderStars(product.rating?.rate)}</span>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>
              {product.rating?.rate} · {product.rating?.count} reviews
            </span>
          </div>

          <div className="detail-price">${product.price?.toFixed(2)}</div>

          <p className="detail-description">{product.description}</p>

          <div className="detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAdd}
              disabled={added}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <Link to="/cart">
              <button className="btn btn-outline btn-lg" style={{ width: "100%" }}>
                View Cart
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;