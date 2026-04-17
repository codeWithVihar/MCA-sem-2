const express = require("express");
const router = express.Router();

const {
  getSalesVsPurchase,
  getSalesVsPurchaseByMonth,
  getProfit,
  getInventoryValue,
  getStockStatus,
  getReorderML,
  getDeadStock,
  getSalesForecast,
  getInventoryTurnover
} = require("../controllers/analyticsController");

const { protect } = require("../middleware/authMiddleware");

/* ===== ROUTES ===== */

router.get("/sales-vs-purchase-month", protect, getSalesVsPurchaseByMonth);

router.get("/profit", protect, getProfit);

router.get("/inventory-value", protect, getInventoryValue);

router.get("/stock-status", protect, getStockStatus);

router.get("/reorder-ml", protect, getReorderML);

router.get("/dead-stock", protect, getDeadStock);

router.get("/sales-forecast", protect, getSalesForecast);

router.get("/inventory-turnover", protect, getInventoryTurnover);

module.exports = router;