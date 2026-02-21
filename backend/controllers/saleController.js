const Product = require("../models/Product");
const Sale = require("../models/Sale");
const logAudit = require("../utils/auditLogger");

/* ================= HELPER ================= */
const updateStockStatus = (product) => {
  if (product.currentStock === 0) {
    product.stockStatus = "OUT_OF_STOCK";
  } else if (product.currentStock <= product.minStockLevel) {
    product.stockStatus = "LOW_STOCK";
  } else {
    product.stockStatus = "IN_STOCK";
  }
};

/* ================= CREATE MULTI-ITEM SALE ================= */
exports.createSale = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalSubAmount = 0;
    let totalGSTAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.currentStock < item.quantitySold) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}`,
        });
      }

      const subTotal = product.sellingPrice * item.quantitySold;
      const gstAmount = (subTotal * (product.gstPercent || 0)) / 100;
      const totalAmount = subTotal + gstAmount;

      totalSubAmount += subTotal;
      totalGSTAmount += gstAmount;

      saleItems.push({
        product: product._id,
        quantitySold: item.quantitySold,
        sellingPrice: product.sellingPrice,
        subTotal,
        gstPercent: product.gstPercent,
        gstAmount,
        totalAmount,
      });

      // Reduce stock
      product.currentStock -= item.quantitySold;
      updateStockStatus(product);
      await product.save();
    }

    const invoiceNumber = "INV-" + Date.now();

    const sale = await Sale.create({
      invoiceNumber,
      items: saleItems,
      totalSubAmount,
      totalGSTAmount,
      grandTotal: totalSubAmount + totalGSTAmount,
    });

    /* 🔥 AUDIT LOG */
    await logAudit({
      action: "CREATE_SALE",
      performedBy: req.user.id,
      entityType: "Sale",
      entityId: sale._id,
      details: {
        invoiceNumber: sale.invoiceNumber,
        totalItems: sale.items.length,
        grandTotal: sale.grandTotal,
      },
    });

    res.status(201).json({
      success: true,
      message: "Multi-item sale completed",
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SALE BY ID ================= */
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("items.product", "productName sellingPrice");

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= SALES SUMMARY ================= */
exports.getSalesSummary = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          totalGST: { $sum: "$totalGSTAmount" },
          totalSales: { $sum: 1 }
        }
      }
    ]);

    const summary = result[0] || {
      totalRevenue: 0,
      totalGST: 0,
      totalSales: 0
    };

    res.json(summary);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= MONTHLY SALES TREND ================= */
exports.getMonthlySales = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalRevenue: { $sum: "$grandTotal" }
        }
      }
    ]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      totalRevenue: 0
    }));

    sales.forEach(sale => {
      const index = sale._id.day - 1;
      dailyData[index].totalRevenue = sale.totalRevenue;
    });

    res.json(dailyData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= TOP SELLING PRODUCTS ================= */
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantitySold" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 0,
          productName: "$productDetails.productName",
          totalQuantity: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= FAST / SLOW MOVING ================= */
exports.getProductMovement = async (req, res) => {
  try {
    const movement = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQuantity: { $sum: "$items.quantitySold" },
        },
      },
    ]);

    const fastMoving = movement.filter((p) => p.totalQuantity > 10);
    const slowMoving = movement.filter((p) => p.totalQuantity <= 10);

    res.json({
      fastMoving: fastMoving.length,
      slowMoving: slowMoving.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
