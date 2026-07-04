const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
{
  supplierName: {
    type: String,
    required: true
  },

  contactPerson: String,

  phone: String,

  email: String,

  address: String,

  productsSupplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],

  rating: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  },

  deliveryTimeDays: {
    type: Number,
    default: 7
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);