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

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);