const express = require("express");
const router = express.Router();

const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("Admin"), async (req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "name role")
    .sort({ createdAt: -1 });

  res.json(logs);
});

module.exports = router;
