let users = [];

exports.getAll = (req, res) => res.json(users);

exports.create = (req, res) => {
  const { name, email } = req.body;
  const user = { id: users.length + 1, name, email };
  users.push(user);
  res.status(201).json(user);
};