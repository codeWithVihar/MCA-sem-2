const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema({

  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantityReturned: { type: Number, required: true, min: 1 },

      reason: String
    }
  ],

  refundAmount: Number

}, { timestamps: true });

module.exports = mongoose.model("SalesReturn", salesReturnSchema);