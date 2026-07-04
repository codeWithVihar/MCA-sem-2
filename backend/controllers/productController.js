const Product = require("../models/Product");
const logAudit = require("../utils/auditLogger");

/* ================= CREATE PRODUCT ================= */
exports.createProduct = async (req, res) => {
  try {

    const productData = { ...req.body };

    // ✅ Handle image
    if (req.file) {
      productData.image = req.file.filename;
    }

    const product = await Product.create(productData);

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


/* ================= GET ALL PRODUCTS ================= */
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


/* ================= GET PRODUCT BY ID ================= */
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= LOW STOCK ================= */
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


/* ================= REORDER ================= */
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


/* ================= UPDATE PRODUCT ================= */
exports.updateProduct = async (req, res) => {
  try {

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);
    console.log("ID:", req.params.id);

    const updateData = {};

    /* ================= SAFE FIELD UPDATE ================= */

    if (req.body.productName) updateData.productName = req.body.productName;
    if (req.body.brand) updateData.brand = req.body.brand;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.sku) updateData.sku = req.body.sku;
    if (req.body.unit) updateData.unit = req.body.unit;

    // ✅ convert numbers
    if (req.body.purchasePrice !== undefined && req.body.purchasePrice !== "") updateData.purchasePrice = Number(req.body.purchasePrice);
    if (req.body.sellingPrice !== undefined && req.body.sellingPrice !== "") updateData.sellingPrice = Number(req.body.sellingPrice);
    if (req.body.gstPercent !== undefined && req.body.gstPercent !== "") updateData.gstPercent = Number(req.body.gstPercent);
    if (req.body.discountPercent !== undefined && req.body.discountPercent !== "") updateData.discountPercent = Number(req.body.discountPercent);
    if (req.body.minStockLevel !== undefined && req.body.minStockLevel !== "") updateData.minStockLevel = Number(req.body.minStockLevel);
    if (req.body.currentStock !== undefined && req.body.currentStock !== "") updateData.currentStock = Number(req.body.currentStock);

    // ✅ booleans
    updateData.returnable = req.body.returnable === "true";
    updateData.damageProne = req.body.damageProne === "true";
    updateData.hazardous = req.body.hazardous === "true";

    // 🔥 MAIN FIX (FOR IMAGE)
    if (req.file) {
      updateData.image = req.file.filename;
      console.log("IMAGE SAVING:", req.file.filename);
    }

    /* ================= UPDATE ================= */

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },   // 🔥 IMPORTANT
      { new: true }
    );

    console.log("UPDATED PRODUCT:", updated);

    /* 🔥 AUDIT LOG */
    await logAudit({
      action: "UPDATE_PRODUCT",
      performedBy: req.user.id,
      entityType: "Product",
      entityId: updated._id,
      details: { productName: updated.productName }
    });

    res.json({
      success: true,
      product: updated
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};