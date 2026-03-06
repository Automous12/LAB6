exports.validateFields = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => !(f in req.body));
  if (missing.length)
    return res.status(400).json({ error: `${missing.join(", ")} required` });
  next();
};