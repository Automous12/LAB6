// ─── In-Memory "Database" ────────────────────────────────────────────────────
// No MongoDB needed — data lives in memory while server is running.

let products = [
  { _id: "1", title: "Wireless Headphones", description: "Premium noise-cancelling headphones with 30hr battery life.", price: 79.99, category: "electronics", image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", rating: { rate: 4.5, count: 120 } },
  { _id: "2", title: "Running Sneakers",    description: "Lightweight and breathable shoes for everyday running.",      price: 49.99, category: "clothing",    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg", rating: { rate: 4.2, count: 85 } },
  { _id: "3", title: "Leather Wallet",      description: "Slim genuine leather wallet with RFID blocking.",             price: 24.99, category: "accessories", image: "https://fakestoreapi.com/img/81fAZal24fL._AC_UY879_.jpg",            rating: { rate: 4.7, count: 200 } },
  { _id: "4", title: "Smart Watch",         description: "Track fitness, notifications and more on your wrist.",        price: 129.99,category: "electronics", image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",           rating: { rate: 4.3, count: 95 } },
  { _id: "5", title: "Backpack",            description: "Durable 30L backpack with laptop compartment.",              price: 39.99, category: "accessories", image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",           rating: { rate: 4.1, count: 60 } },
  { _id: "6", title: "Denim Jacket",        description: "Classic fit denim jacket, available in all sizes.",          price: 59.99, category: "clothing",    image: "https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg",        rating: { rate: 4.0, count: 45 } },
];

let users  = [];
let orders = [];

const newId = () => Date.now().toString();

module.exports = { products, users, orders, newId };