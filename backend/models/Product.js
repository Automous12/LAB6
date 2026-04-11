const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    price:       { type: Number, required: true },
    category:    { type: String, default: "general" },
    image:       { type: String, default: "" },
    rating: {
      rate:  { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);