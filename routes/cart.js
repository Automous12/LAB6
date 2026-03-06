const express = require("express");
const { getAll, create } = require("../controllers/cartController");
const { validateFields } = require("../middleware/validateFields");
const router = express.Router();

router.get("/", getAll);
router.post("/", validateFields(["userId", "productId", "quantity"]), create);

module.exports = router;