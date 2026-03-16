const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: Number,

      purchasePrice: Number,

      total: Number
    }
  ],

  totalAmount: Number,

  purchaseDate: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);