const express = require("express");
const router = express.Router();

const { processSalesReturn } = require("../controllers/salesReturnController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("Admin", "Manager", "Staff"),
  processSalesReturn
);

module.exports = router;