const Product = require("../models/Product");
const Sale = require("../models/Sale");
const StockTransaction = require("../models/StockTransaction");
const updateStockStatus = require("../utils/stockHelper");

/* ================= SALES RETURN ================= */

exports.processSalesReturn = async (req, res) => {

  try {

    const { saleId, items, reason } = req.body;

    if (!saleId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Sale ID and items are required"
      });
    }

    /* Find sale by invoice number */

    const sale = await Sale.findOne({
      invoiceNumber: saleId
    }).populate("items.product");

    if (!sale) {
      return res.status(404).json({
        message: "Invoice not found"
      });
    }

    if (!sale.items || sale.items.length === 0) {
      return res.status(400).json({
        message: "Sale has no items"
      });
    }

    for (const item of items) {

      const saleItem = sale.items.find(
        (i) => i.product && i.product._id.toString() === item.productId
      );

      if (!saleItem) {
        return res.status(400).json({
          message: "Product not found in sale"
        });
      }

      if (item.quantity > saleItem.quantitySold) {
        return res.status(400).json({
          message: "Return quantity exceeds sold quantity"
        });
      }

      /* Get product */

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      /* Increase stock */

      product.currentStock += Number(item.quantity);

      /* Update stock status */

      await updateStockStatus(product, false);
      await product.save();

      /* Save stock transaction */

      await StockTransaction.create({

        product: product._id,
        type: "IN",
        quantity: Number(item.quantity),
        reason: reason || "Sales Return"

      });

    }

    res.json({
      success: true,
      message: "Sales return processed successfully"
    });

  } catch (error) {

    console.error("Sales Return Error:", error);

    res.status(500).json({
      message: "Server error while processing return"
    });

  }

};