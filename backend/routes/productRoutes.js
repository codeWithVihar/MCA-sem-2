const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  getReorderSuggestions,
  updateProduct
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔐 Admin only
router.post("/", protect, authorize("Admin"), createProduct);

// 🔐 Admin + Manager
router.get("/low-stock", protect, authorize("Admin", "Manager"), getLowStockProducts);

// 🔐 Reorder Suggestions (PUT THIS BEFORE /:id)
router.get("/reorder", protect, authorize("Admin","Manager"), getReorderSuggestions);

// 🔐 All logged-in users
router.get("/", protect, getAllProducts);

// 🔐 Update product
router.put("/:id", protect, authorize("Admin", "Manager"), updateProduct);

module.exports = router;
