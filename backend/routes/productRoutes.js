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

// 🔐 Admin only
router.post("/", protect, authorize("Admin"), createProduct);

// 🔐 Admin + Manager
router.get("/low-stock", protect, authorize("Admin", "Manager"), getLowStockProducts);

// 🔐 Reorder Suggestions (PUT THIS BEFORE /:id)
router.get("/reorder", protect, authorize("Admin","Manager"), getReorderSuggestions);

// 🔐 All logged-in users
router.get("/", getAllProducts);

router.put("/:id", protect, upload.single("image"), updateProduct);

// 🔐 Update product
router.put("/:id", protect, authorize("Admin", "Manager"), updateProduct);

router.get("/:id", protect, getProductById);



module.exports = router;
