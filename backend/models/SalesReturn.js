const mongoose = require("mongoose");

const salesReturnSchema = new mongoose.Schema({

  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantityReturned: Number,

      reason: String
    }
  ],

  refundAmount: Number

}, { timestamps: true });

module.exports = mongoose.model("SalesReturn", salesReturnSchema);