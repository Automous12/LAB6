import axios from "axios";

// In dev: CRA proxy (package.json → "proxy") forwards /api → localhost:5000
// In prod: Vercel routes /api → backend serverless function (same domain, no CORS)
const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const getProducts   = (params) => API.get("/products", { params });
export const getProduct    = (id)     => API.get(`/products/${id}`);
export const getCategories = ()       => API.get("/products/categories");
export const createProduct = (data)   => API.post("/products", data);
export const updateProduct = (id, d)  => API.put(`/products/${id}`, d);
export const deleteProduct = (id)     => API.delete(`/products/${id}`);

// Auth
export const sendOtp   = (phone)      => API.post("/auth/send-otp",   { phone });
export const verifyOtp = (phone, otp) => API.post("/auth/verify-otp", { phone, otp });

// Orders
export const createOrder      = (data)    => API.post("/orders", data);
export const getOrders        = ()        => API.get("/orders");
export const getMyOrders      = ()        => API.get("/orders/my");
export const getOrderById     = (id)      => API.get(`/orders/${id}`);
export const updateOrderStatus= (id, s)   => API.patch(`/orders/${id}`, { status: s });

// Users
export const getAllUsers = () => API.get("/users");

export default API;