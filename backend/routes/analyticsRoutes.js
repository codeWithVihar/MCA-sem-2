const express = require("express");

const router = express.Router();

const {
  getSalesVsPurchase,
  getProfit,
  getInventoryValue,
  getStockStatus,
  getReorderML
} = require("../controllers/analyticsController");

const { protect, authorize } = require("../middleware/authMiddleware");


router.get("/sales-vs-purchase", protect, getSalesVsPurchase);

router.get("/profit", protect, getProfit);

router.get("/inventory-value", protect, getInventoryValue);

router.get("/stock-status", protect, getStockStatus);

router.get("/reorder-ml", protect, getReorderML);
const {
  getDeadStock,
  getSalesForecast,
  getInventoryTurnover
} = require("../controllers/analyticsController");

router.get("/dead-stock", protect, getDeadStock);

router.get("/sales-forecast", protect, getSalesForecast);

router.get("/inventory-turnover", protect, getInventoryTurnover);
module.exports = router;