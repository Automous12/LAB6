const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const upload  = multer({ storage: multer.memoryStorage() });

const { authenticateToken, requireAdmin, optionalAuth } = require("./middleware/auth");
const {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories,
  sendOtp, verifyOtp,
  createOrder, getAllOrders, getOrderById, getMyOrders, updateOrderStatus,
  getAllUsers,
} = require("./controllers");

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
router.get   ("/products/categories",  getCategories);
router.get   ("/products",             getAllProducts);
router.get   ("/products/:id",         getProductById);
router.post  ("/products",             authenticateToken, requireAdmin, upload.single("image"), createProduct);
router.put   ("/products/:id",         authenticateToken, requireAdmin, upload.single("image"), updateProduct);
router.delete("/products/:id",         authenticateToken, requireAdmin, deleteProduct);

// ── AUTH ──────────────────────────────────────────────────────────────────────
router.post("/auth/send-otp",   sendOtp);
router.post("/auth/verify-otp", verifyOtp);

// ── ORDERS ────────────────────────────────────────────────────────────────────
router.get  ("/orders/my",  authenticateToken, getMyOrders);
router.get  ("/orders",     authenticateToken, requireAdmin, getAllOrders);
router.get  ("/orders/:id", authenticateToken, getOrderById);
router.post ("/orders",     optionalAuth, createOrder);
router.patch("/orders/:id", authenticateToken, requireAdmin, updateOrderStatus);

// ── USERS ─────────────────────────────────────────────────────────────────────
router.get("/users", authenticateToken, requireAdmin, getAllUsers);

module.exports = router;