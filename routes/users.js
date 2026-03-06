const express = require("express");
const { getAll, create } = require("../controllers/userController");
const { validateFields } = require("../middleware/validateFields");
const router = express.Router();

router.get("/", getAll);
router.post("/", validateFields(["name", "email"]), create);

module.exports = router;