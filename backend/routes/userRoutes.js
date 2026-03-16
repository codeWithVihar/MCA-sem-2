const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("Admin"), getAllUsers);
router.post("/", protect, authorize("Admin"), createUser);
router.put("/:id", protect, authorize("Admin"), updateUser);
router.put("/deactivate/:id", protect, authorize("Admin"), deactivateUser);
router.put("/activate/:id", protect, authorize("Admin"), activateUser);

module.exports = router;