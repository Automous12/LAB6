const express = require("express");
const router = express.Router();
const {
  // products
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories,
  // users
  registerUser, loginUser, getAllUsers,
  // orders
  createOrder, getAllOrders, getOrderById, updateOrderStatus,
} = require("./controllers");

// ════════════════════════════════════════════════
//  PRODUCT ROUTES  →  /api/products
// ════════════════════════════════════════════════
router.get   ("/products/categories",  getCategories);   // GET  /api/products/categories
router.get   ("/products",             getAllProducts);   // GET  /api/products?category=&limit=
router.get   ("/products/:id",         getProductById);  // GET  /api/products/:id
router.post  ("/products",             createProduct);   // POST /api/products
router.put   ("/products/:id",         updateProduct);   // PUT  /api/products/:id
router.delete("/products/:id",         deleteProduct);   // DEL  /api/products/:id

// ════════════════════════════════════════════════
//  USER ROUTES  →  /api/users
// ════════════════════════════════════════════════
router.get ("/users",          getAllUsers);   // GET  /api/users
router.post("/users/register", registerUser); // POST /api/users/register
router.post("/users/login",    loginUser);    // POST /api/users/login

// ════════════════════════════════════════════════
//  ORDER ROUTES  →  /api/orders
// ════════════════════════════════════════════════
router.get  ("/orders",          getAllOrders);      // GET  /api/orders
router.get  ("/orders/:id",      getOrderById);      // GET  /api/orders/:id
router.post ("/orders",          createOrder);       // POST /api/orders
router.patch("/orders/:id",      updateOrderStatus); // PATCH /api/orders/:id  { status }

module.exports = router;