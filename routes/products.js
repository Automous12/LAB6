const express = require("express");
const { getAll, create } = require("../controllers/productController");
const { validateFields } = require("../middleware/validateFields");
const router = express.Router();

router.get("/", getAll);
router.post("/", validateFields(["name", "price"]), create);

module.exports = router;