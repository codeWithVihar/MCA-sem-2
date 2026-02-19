const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  /* 1. Basic Product Identification */
  productName: { type: String, required: true },
  brand: { type: String },
  category: { type: String, required: true },
  subCategory: { type: String },
  modelNumber: { type: String },
  sku: { type: String, unique: true, sparse: true },
  barcode: { type: String },

  /* 2. Physical & Technical Specifications */
  materialType: { type: String },
  dimensions: {
    length: Number,
    width: Number,
    thickness: Number
  },
  weight: Number,
  color: String,
  voltage: String,
  grade: String,
  compatibility: String,

  /* 3. Inventory & Stock Details */
  currentStock: { type: Number, default: 0 },
  minStockLevel: { type: Number, default: 10 },
  maxStockLevel: { type: Number },
  unit: { type: String, default: "Piece" },
  warehouseLocation: String,
  rackNumber: String,
  batchNumber: String,

  stockStatus: {
  type: String,
  enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
  default: "IN_STOCK"
},


  /* 4. Purchase & Supplier Information */
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier"
  },
  purchasePrice: Number,
  lastPurchaseDate: Date,
  leadTimeDays: Number,
  supplierWarranty: String,

  /* 5. Pricing & Sales Information */
  sellingPrice: Number,
  discountPercent: { type: Number, default: 0 },
  gstPercent: { type: Number, default: 18 },

  /* 6. Warranty & Lifecycle */
  warrantyPeriodMonths: Number,
  warrantyStartDate: Date,
  warrantyEndDate: Date,
  expiryDate: Date,

  /* 7. Demand & Analytics Data */
  dailySalesAvg: Number,
  monthlySalesAvg: Number,
  fastMoving: { type: Boolean, default: false },
  slowMoving: { type: Boolean, default: false },
  predictedReorderQty: Number,

  /* 8. Security & Audit */
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  /* 9. Description & Media */
  description: String,
  usageInstructions: String,
  safetyGuidelines: String,
  images: [String],
  manuals: [String],

  /* 10. Status & Flags */
  status: {
    type: String,
    enum: ["Active", "Inactive", "Discontinued"],
    default: "Active"
  },
  returnable: { type: Boolean, default: true },
  damageProne: { type: Boolean, default: false },
  hazardous: { type: Boolean, default: false }


}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
