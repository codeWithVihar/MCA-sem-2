const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
const logAudit = require("../utils/auditLogger");

const updateStockStatus = (product) => {
  if (product.currentStock === 0) {
    product.stockStatus = "OUT_OF_STOCK";
  } else if (product.currentStock <= product.minStockLevel) {
    product.stockStatus = "LOW_STOCK";
  } else {
    product.stockStatus = "IN_STOCK";
  }
};

/* STOCK IN (Purchase / Add Stock) */
exports.stockIn = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    


    product.currentStock += quantity;
    updateStockStatus(product);
    await product.save();
    await logAudit({
  action: "STOCK_UPDATE",
  performedBy: req.user.id,
  entityType: "Product",
  entityId: productId,
  details: {
    type,          // IN or OUT
    quantity       // how much changed
  }
});

    await StockTransaction.create({
      product: productId,
      type: "IN",
      quantity,
      reason
    });

    res.json({
      success: true,
      message: "Stock added successfully",
      currentStock: product.currentStock
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* STOCK OUT (Sale / Remove Stock) */
exports.stockOut = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.currentStock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }
  

    product.currentStock -= quantity;
    updateStockStatus(product);
    await product.save();

    await StockTransaction.create({
      product: productId,
      type: "OUT",
      quantity,
      reason
    });

    res.json({
      success: true,
      message: "Stock removed successfully",
      currentStock: product.currentStock
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



/* GET STOCK HISTORY FOR A PRODUCT */
exports.getStockHistoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const history = await StockTransaction.find({ product: productId })
      .populate("product", "productName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL STOCK HISTORY */
exports.getAllStockHistory = async (req, res) => {
  try {
    const history = await StockTransaction.find()
      .populate("product", "productName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  exports.updateStockStatus
};

