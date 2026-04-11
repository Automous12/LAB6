const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const routes = require("./routes");
const app    = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let dbConnected = false;
const connectDB = async () => {
  if (dbConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  dbConnected = true;
  console.log("✅ MongoDB connected");
};

// Allow all origins for Vercel
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(500).json({ error: "DB connection failed" }); }
});

app.use("/api", routes);
app.get("/", (req, res) => res.json({ message: "LuxeShop API 🚀" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
module.exports = app;