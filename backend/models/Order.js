const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    address: { type: String, required: true },
    phone:   { type: String, default: "" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title:    String,
        price:    Number,
        quantity: Number,
        image:    String,
      },
    ],
    total:         { type: Number, required: true },
    status:        { type: String, default: "pending" },
    paymentStatus: { type: String, default: "paid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);