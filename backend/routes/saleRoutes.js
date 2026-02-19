const express = require("express");
const router = express.Router();

const {
  createSale,
  getSaleById,
  getSalesSummary,
  getMonthlySales,
  getTopProducts,
  getProductMovement
} = require("../controllers/saleController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ✅ Create sale
router.post(
  "/",
  protect,
  authorize("Admin", "Manager", "Staff"),
  createSale
);

// ✅ IMPORTANT: Put /summary BEFORE /:id
router.get("/summary", protect, authorize("Admin","Manager"), getSalesSummary);

router.get("/monthly", protect, authorize("Admin","Manager"), getMonthlySales);

router.get("/top-products", protect, authorize("Admin","Manager"), getTopProducts);

router.get("/movement", protect, authorize("Admin","Manager"), getProductMovement);

router.get("/:id", protect, authorize("Admin","Manager","Staff"), getSaleById);

// ✅ Get single sale (invoice)
router.get(
  "/:id",
  protect,
  authorize("Admin", "Manager", "Staff"),
  getSaleById
);

module.exports = router;
