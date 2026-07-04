const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getSalesPrediction,
  getDemandForecast,
  getRestock,
  getStockout,
  getProfit,
  getFastMoving,
  getSupplier,
  train,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.get("/dashboard", protect, getDashboard);
router.get("/sales-prediction", protect, getSalesPrediction);
router.get("/demand-forecast", protect, getDemandForecast);
router.get("/restock", protect, getRestock);
router.get("/stockout", protect, getStockout);
router.get("/profit", protect, getProfit);
router.get("/fast-moving", protect, getFastMoving);
router.get("/supplier", protect, getSupplier);
router.post("/train", protect, train);

module.exports = router;
