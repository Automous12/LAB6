const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const routes = require("./routes");
const app    = express();

// ── Cloudinary ────────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── MongoDB — cache connection for serverless ─────────────────────────────────
let dbConnected = false;
const connectDB = async () => {
  if (dbConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  dbConnected = true;
  console.log("✅ MongoDB connected");
};

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ error: "DB connection failed" }); }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", routes);
app.get("/", (req, res) => res.json({ message: "LuxeShop API 🚀" }));

// ── Local dev server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
}

module.exports = app;   // Vercel needs this export