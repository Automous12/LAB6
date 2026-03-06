const Cart = require("../models/Cart");

// CREATE
exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.create(req.body);
    res.status(201).json({ message: "Cart created", cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("user", "name email").populate("items.product", "name price");
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE by ID
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("user", "name email").populate("items.product", "name price");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
