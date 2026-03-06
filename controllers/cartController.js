let cart = [];

exports.getAll = (req, res) => res.json(cart);

exports.create = (req, res) => {
  const { userId, productId, quantity } = req.body;
  const item = { id: cart.length + 1, userId, productId, quantity };
  cart.push(item);
  res.status(201).json(item);
};