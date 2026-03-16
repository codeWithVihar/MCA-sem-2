const express = require("express");
const router = express.Router();

const {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} = require("../controllers/supplierController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("Admin"), createSupplier);

router.get("/", protect, getSuppliers);

router.put("/:id", protect, authorize("Admin"), updateSupplier);

router.delete("/:id", protect, authorize("Admin"), deleteSupplier);

module.exports = router;