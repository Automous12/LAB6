exports.notFoundHandler = (req, res) => {
  res.status(404).json({ error: "Route not found" });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};