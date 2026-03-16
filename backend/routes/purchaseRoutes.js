const express = require("express");
const router = express.Router();

const { createPurchase } = require("../controllers/purchaseController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/",
  protect,
  upload.single("image"),   // 👈 VERY IMPORTANT
  createPurchase
);

module.exports = router;