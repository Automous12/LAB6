import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// ─── Products ────────────────────────────────────────────────────────────────
export const getProducts   = (params) => API.get("/products", { params });
export const getProduct    = (id)     => API.get(`/products/${id}`);
export const getCategories = ()       => API.get("/products/categories");
export const createProduct = (data)   => API.post("/products", data);
export const updateProduct = (id, d)  => API.put(`/products/${id}`, d);
export const deleteProduct = (id)     => API.delete(`/products/${id}`);

// ─── Users ───────────────────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser    = (data) => API.post("/users/login", data);

// ─── Orders ──────────────────────────────────────────────────────────────────
export const createOrder      = (data) => API.post("/orders", data);
export const getOrders        = ()     => API.get("/orders");
export const getOrderById     = (id)   => API.get(`/orders/${id}`);
export const updateOrderStatus= (id,s) => API.patch(`/orders/${id}`, { status: s });

export default API;