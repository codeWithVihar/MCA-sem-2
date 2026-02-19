const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin only
router.get("/", protect, authorize("Admin"), getAllUsers);
router.post("/", protect, authorize("Admin"), createUser);
router.put("/:id", protect, authorize("Admin"), updateUser);
router.patch("/:id/deactivate", protect, authorize("Admin"), deactivateUser);

module.exports = router;
