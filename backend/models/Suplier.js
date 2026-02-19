const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  contactPerson: String,
  phone: String,
  email: String,
  address: String,
  averageLeadTime: Number,
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model("Supplier", supplierSchema);
