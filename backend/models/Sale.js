const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantitySold: { type: Number, required: true, min: 1 },
        sellingPrice: { type: Number, required: true },
        subTotal: Number,
        gstPercent: Number,
        gstAmount: Number,
        totalAmount: Number,
      },
    ],

    totalSubAmount: { type: Number, default: 0 },
    totalGSTAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
