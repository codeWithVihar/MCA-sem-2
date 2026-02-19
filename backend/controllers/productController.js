const Product = require("../models/Product");
const logAudit = require("../utils/auditLogger");

// ================= CREATE PRODUCT =================
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // 🔥 Add Audit Log
    
    await logAudit({
      action: "CREATE_PRODUCT",
      performedBy: req.user.id,
      entityType: "Product",
      entityId: product._id,
      details: { productName: product.productName }
    });

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET LOW STOCK =================
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stockStatus: { $in: ["LOW_STOCK", "OUT_OF_STOCK"] }
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= REORDER SUGGESTIONS =================
exports.getReorderSuggestions = async (req, res) => {
  try {
    const products = await Product.find();

    const suggestions = products
      .filter(p => p.currentStock < p.minStockLevel)
      .map(p => ({
        productName: p.productName,
        currentStock: p.currentStock,
        suggestedOrder: p.minStockLevel * 2
      }));

    res.json(suggestions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
