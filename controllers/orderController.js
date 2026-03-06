let orders = [];

exports.getAll = (req, res) => res.json(orders);

exports.create = (req, res) => {
  const { userId, items } = req.body;
  const order = { id: orders.length + 1, userId, items, createdAt: new Date() };
  orders.push(order);
  res.status(201).json(order);
};