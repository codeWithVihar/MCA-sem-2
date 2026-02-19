const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  entityType: {
    type: String, // Product, Stock, Sale, User
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },

  details: {
    type: Object
  }

}, { timestamps: true });

module.exports = mongoose.model("AuditLog", auditLogSchema);
