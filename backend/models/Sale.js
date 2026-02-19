const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: String,

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantitySold: Number,
        sellingPrice: Number,
        subTotal: Number,
        gstPercent: Number,
        gstAmount: Number,
        totalAmount: Number,
      },
    ],

    totalSubAmount: Number,
    totalGSTAmount: Number,
    grandTotal: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
