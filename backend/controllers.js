const { products, users, orders, newId } = require("./models");

// ════════════════════════════════════════════════
//  PRODUCT CONTROLLERS
// ════════════════════════════════════════════════

const getAllProducts = (req, res) => {
  const { category } = req.query;
  const result = category ? products.filter(p => p.category === category) : products;
  res.json(result);
};

const getProductById = (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

const createProduct = (req, res) => {
  const product = { _id: newId(), ...req.body };
  products.push(product);
  res.status(201).json(product);
};

const updateProduct = (req, res) => {
  const idx = products.findIndex(p => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
};

const deleteProduct = (req, res) => {
  const idx = products.findIndex(p => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(idx, 1);
  res.json({ message: "Product deleted" });
};

const getCategories = (req, res) => {
  const cats = [...new Set(products.map(p => p.category))];
  res.json(cats);
};

// ════════════════════════════════════════════════
//  USER CONTROLLERS
// ════════════════════════════════════════════════

const registerUser = (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email))
    return res.status(400).json({ error: "Email already registered" });
  const user = { _id: newId(), name, email, password };
  users.push(user);
  res.status(201).json({ message: "User registered", userId: user._id });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ message: "Login successful", userId: user._id, name: user.name });
};

const getAllUsers = (req, res) => {
  res.json(users.map(({ password, ...u }) => u));
};

// ════════════════════════════════════════════════
//  ORDER CONTROLLERS
// ════════════════════════════════════════════════

const createOrder = (req, res) => {
  const order = { _id: newId(), status: "pending", createdAt: new Date(), ...req.body };
  orders.push(order);
  res.status(201).json({ message: "Order placed!", orderId: order._id, order });
};

const getAllOrders = (req, res) => {
  res.json([...orders].reverse());
};

const getOrderById = (req, res) => {
  const order = orders.find(o => o._id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
};

const updateOrderStatus = (req, res) => {
  const idx = orders.findIndex(o => o._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Order not found" });
  orders[idx].status = req.body.status;
  res.json(orders[idx]);
};

module.exports = {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories,
  registerUser, loginUser, getAllUsers,
  createOrder, getAllOrders, getOrderById, updateOrderStatus,
};