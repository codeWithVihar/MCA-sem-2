const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["PENDING", "DISPATCHED", "COMPLETED", "REJECTED"],
    default: "PENDING"
  },

  customerName: String,
  customerPhone: String,

  // NEW
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
  },

  customerAddress: String,

  // Link generated sale/invoice
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);