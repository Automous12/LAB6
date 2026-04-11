const Product   = require("./models/Product");
const User      = require("./models/User");
const Order     = require("./models/Order");
const jwt       = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

// ── helper: upload buffer to Cloudinary ──────────────────────────────────────
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "luxeshop" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

// ════════════════════════════════════════════════
//  PRODUCT CONTROLLERS
// ════════════════════════════════════════════════

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    res.json(await Product.find(filter));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const createProduct = async (req, res) => {
  try {
    let imageUrl = req.body.image || "";
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const product = await Product.create({
      title:       req.body.title,
      description: req.body.description || "",
      price:       parseFloat(req.body.price),
      category:    req.body.category,
      image:       imageUrl,
    });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const updateData = {
      title:       req.body.title,
      description: req.body.description,
      price:       parseFloat(req.body.price),
      category:    req.body.category,
    };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.image = result.secure_url;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getCategories = async (req, res) => {
  try {
    res.json(await Product.distinct("category"));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ════════════════════════════════════════════════
//  AUTH CONTROLLERS
// ════════════════════════════════════════════════

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    // Fixed OTP for demo — always 0000
    await User.findOneAndUpdate(
      { phone },
      { phone, otp: "0000", otpExpiry: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );

    res.json({ message: "OTP sent (use 0000 for demo)" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

    const user = await User.findOne({ phone });
    if (!user)            return res.status(404).json({ error: "Request OTP first" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: "OTP expired" });

    // Clear OTP after use
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const isAdmin = phone === process.env.ADMIN_PHONE;
    const token   = jwt.sign({ userId: user._id, phone, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, phone, name: user.name, isAdmin } });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ════════════════════════════════════════════════
//  ORDER CONTROLLERS
// ════════════════════════════════════════════════

const createOrder = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user) data.userId = req.user.userId;   // attach user if logged in
    const order = await Order.create(data);
    res.status(201).json({ message: "Order placed!", orderId: order._id, order });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getAllOrders = async (req, res) => {
  try {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    res.json(await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ════════════════════════════════════════════════
//  USER CONTROLLERS
// ════════════════════════════════════════════════

const getAllUsers = async (req, res) => {
  try {
    res.json(await User.find({}, "-otp -otpExpiry"));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories,
  sendOtp, verifyOtp,
  createOrder, getAllOrders, getOrderById, getMyOrders, updateOrderStatus,
  getAllUsers,
};