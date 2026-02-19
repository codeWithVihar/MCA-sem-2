const AuditLog = require("../models/AuditLog");

const logAudit = async ({ action, performedBy, entityType, entityId, details }) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      entityType,
      entityId,
      details
    });
  } catch (error) {
    console.log("Audit log error:", error.message);
  }
};

module.exports = logAudit;
