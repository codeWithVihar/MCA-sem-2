const express = require("express");
const router = express.Router();

const {
  stockIn,
  stockOut,
  getAllStockHistory,
  getStockHistoryByProduct
} = require("../controllers/stockController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Manager + Admin
router.post("/in", protect, authorize("Admin", "Manager"), stockIn);
router.post("/out", protect, authorize("Admin", "Manager"), stockOut);

// Admin only (audit)
router.get("/history", protect, authorize("Admin"), getAllStockHistory);
router.get("/history/:productId", protect, authorize("Admin"), getStockHistoryByProduct);

module.exports = router;
