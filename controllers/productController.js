let products = [];

exports.getAll = (req, res) => res.json(products);

exports.create = (req, res) => {
  const { name, price } = req.body;
  const product = { id: products.length + 1, name, price };
  products.push(product);
  res.status(201).json(product);
};