const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const products = [
  { title: "Wireless Headphones", description: "Premium noise-cancelling headphones with 30hr battery life.", price: 79.99, category: "electronics", image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", rating: { rate: 4.5, count: 120 } },
  { title: "Running Sneakers",    description: "Lightweight and breathable shoes for everyday running.",      price: 49.99, category: "clothing",    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg", rating: { rate: 4.2, count: 85 } },
  { title: "Leather Wallet",      description: "Slim genuine leather wallet with RFID blocking.",             price: 24.99, category: "accessories", image: "https://fakestoreapi.com/img/81fAZal24fL._AC_UY879_.jpg",            rating: { rate: 4.7, count: 200 } },
  { title: "Smart Watch",         description: "Track fitness, notifications and more on your wrist.",        price: 129.99,category: "electronics", image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",           rating: { rate: 4.3, count: 95 } },
  { title: "Backpack",            description: "Durable 30L backpack with laptop compartment.",              price: 39.99, category: "accessories", image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",           rating: { rate: 4.1, count: 60 } },
  { title: "Denim Jacket",        description: "Classic fit denim jacket, available in all sizes.",          price: 59.99, category: "clothing",    image: "https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg",        rating: { rate: 4.0, count: 45 } },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(products);
    console.log("✅ Seeded 6 products");
  } else {
    console.log(`ℹ️  ${count} products already exist — skipping seed`);
  }
  await mongoose.disconnect();
}

seed().catch(console.error);