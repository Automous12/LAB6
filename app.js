const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/productRoutes");
const userRoutes    = require("./routes/userRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const cartRoutes    = require("./routes/cartRoutes");

const app = express();
app.use(express.json());

// ── Connect to MongoDB ──────────────────────────
mongoose.connect("mongodb://localhost:27017/practical6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Error:", err));

// ── Routes ──────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/cart",     cartRoutes);

// ── Start Server ────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
