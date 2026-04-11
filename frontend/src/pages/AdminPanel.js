import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getOrders, updateOrderStatus,
} from "../services/api";

function AdminPanel() {
  const { isAdmin } = useAuth();
  const [tab,         setTab]        = useState("products");
  const [products,    setProducts]   = useState([]);
  const [orders,      setOrders]     = useState([]);
  const [loading,     setLoading]    = useState(false);
  const [showForm,    setShowForm]   = useState(false);
  const [editTarget,  setEditTarget] = useState(null);
  const [form,        setForm]       = useState({ title: "", description: "", price: "", category: "", image: "" });
  const [imageFile,   setImageFile]  = useState(null);
  const [imgPreview,  setImgPreview] = useState("");
  const [formError,   setFormError]  = useState("");

  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    tab === "products" ? loadProducts() : loadOrders();
  }, [tab]);

  const loadProducts = async () => {
    setLoading(true);
    const res = await getProducts({});
    setProducts(res.data);
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    const res = await getOrders();
    setOrders(res.data);
    setLoading(false);
  };

  const openNew = () => {
    setEditTarget(null);
    setForm({ title: "", description: "", price: "", category: "", image: "" });
    setImageFile(null);
    setImgPreview("");
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({ title: p.title, description: p.description, price: p.price, category: p.category, image: p.image });
    setImageFile(null);
    setImgPreview(p.image);
    setFormError("");
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setFormError("");
    try {
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("price",       form.price);
      fd.append("category",    form.category);
      if (imageFile)      fd.append("image", imageFile);
      else if (form.image) fd.append("image", form.image);

      if (editTarget) await updateProduct(editTarget._id, fd);
      else            await createProduct(fd);

      setShowForm(false);
      loadProducts();
    } catch (err) {
      setFormError(err.response?.data?.error || "Save failed");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  };

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    loadOrders();
  };

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="admin-page">
      <h1 className="page-title">Admin Panel</h1>

      <div className="admin-tabs">
        {["products", "orders"].map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Products ── */}
      {tab === "products" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={openNew}>+ Add Product</button>
          </div>

          {showForm && (
            <div className="admin-form-card">
              <h3 style={{ marginBottom: 20 }}>{editTarget ? "Edit Product" : "New Product"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" {...f("title")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" {...f("description")} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (USD)</label>
                  <input className="form-input" type="number" step="0.01" min="0" {...f("price")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className="form-input" {...f("category")} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange}
                    style={{ color: "var(--text)", display: "block", marginBottom: 8 }} />
                  {!imageFile && (
                    <input className="form-input" placeholder="…or paste an image URL" {...f("image")}
                      onChange={(e) => { setForm({ ...form, image: e.target.value }); setImgPreview(e.target.value); }} />
                  )}
                  {imgPreview && (
                    <img src={imgPreview} alt="preview"
                      style={{ height: 80, marginTop: 10, borderRadius: 8, objectFit: "contain", background: "white", padding: 4 }} />
                  )}
                </div>
                {formError && <div className="modal-error" style={{ marginBottom: 16 }}>{formError}</div>}
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Saving…" : "Save"}
                  </button>
                  <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading && !showForm ? (
            <div className="loading"><div className="spinner" /> Loading…</div>
          ) : (
            <div className="admin-product-list">
              {products.map((p) => (
                <div className="admin-product-row" key={p._id}>
                  <img src={p.image} alt={p.title}
                    style={{ width: 52, height: 52, objectFit: "contain", background: "white", borderRadius: 6, padding: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>{p.category} · ${p.price}</div>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="btn btn-danger  btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              ))}
              {products.length === 0 && <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>No products yet</p>}
            </div>
          )}
        </>
      )}

      {/* ── Orders ── */}
      {tab === "orders" && (
        <>
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading…</div>
          ) : (
            <div className="admin-order-list">
              {orders.map((o) => (
                <div className="admin-order-row" key={o._id}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>#{o._id.toString().slice(-8).toUpperCase()}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>{o.name} · {o.email}</div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>
                      {o.items?.length} item(s) · ${o.total?.toFixed(2)}
                    </div>
                  </div>
                  <select className="admin-status-select" value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                    {["pending","processing","shipped","delivered","cancelled"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              ))}
              {orders.length === 0 && <p style={{ color: "var(--muted)", textAlign: "center", padding: 40 }}>No orders yet</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPanel;