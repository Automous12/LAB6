import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../services/api";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductList() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [active,     setActive]     = useState("all");
  const [loading,    setLoading]    = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = active !== "all" ? { category: active } : {};
    getProducts(params)
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [active]);

  const renderStars = (rate = 0) => "★".repeat(Math.round(rate)) + "☆".repeat(5 - Math.round(rate));

  return (
    <div>
      <h1 className="page-title">Our Collection</h1>
      <p className="page-subtitle">{products.length} products available</p>

      {/* Category filter */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${active === "all" ? "active" : ""}`}
          onClick={() => setActive("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${active === cat ? "active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading products…
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div className="product-card" key={p._id}>
              <div className="product-img-wrap">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="product-info">
                <div className="product-category">{p.category}</div>
                <div className="product-title">{p.title}</div>
                <div className="product-footer">
                  <span className="price">${p.price?.toFixed(2)}</span>
                  <span className="rating">
                    <span className="rating-star">★</span>
                    {p.rating?.rate?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <div className="product-actions">
                  <Link to={`/product/${p._id}`} style={{ flex: 1 }}>
                    <button className="btn btn-outline" style={{ width: "100%" }}>Details</button>
                  </Link>
                  <button className="btn btn-primary" onClick={() => addToCart(p)}>
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;