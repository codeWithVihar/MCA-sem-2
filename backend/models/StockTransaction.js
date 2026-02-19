const mongoose = require("mongoose"); // ✅ ADD THIS LINE

const stockTransactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  type: {
    type: String,
    enum: ["IN", "OUT", "ADJUSTMENT"],
    required: true
  },
  quantity: { type: Number, required: true },
  reason: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);
