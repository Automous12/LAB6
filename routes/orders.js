const express = require("express");
const { getAll, create } = require("../controllers/orderController");
const { validateFields } = require("../middleware/validateFields");
const router = express.Router();

router.get("/", getAll);
router.post("/", validateFields(["userId", "items"]), create);

module.exports = router;