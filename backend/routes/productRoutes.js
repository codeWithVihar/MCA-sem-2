const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  getReorderSuggestions,
  updateProduct,
  getProductById
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔐 Admin only (with image upload support)
router.post("/", protect, authorize("Admin"), upload.single("image"), createProduct);

// 🔐 Admin + Manager
router.get("/low-stock", protect, authorize("Admin", "Manager"), getLowStockProducts);

// 🔐 Reorder Suggestions (PUT THIS BEFORE /:id)
router.get("/reorder", protect, authorize("Admin","Manager"), getReorderSuggestions);

// 🔐 All logged-in users
router.get("/", getAllProducts);

// 🔐 Update product (Admin + Manager, with image upload)
router.put("/:id", protect, authorize("Admin", "Manager"), upload.single("image"), updateProduct);

router.get("/:id", protect, getProductById);

module.exports = router;
