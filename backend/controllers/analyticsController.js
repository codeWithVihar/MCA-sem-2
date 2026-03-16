const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");
const Product = require("../models/Product");

/* ================= SALES VS PURCHASE ================= */

exports.getSalesVsPurchase = async (req, res) => {

  try {

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$grandTotal" }
        }
      }
    ]);

    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          purchase: { $sum: "$totalAmount" }
        }
      }
    ]);

    const result = [];

    for (let i = 1; i <= 12; i++) {

      const sale = sales.find(s => s._id === i);
      const purchase = purchases.find(p => p._id === i);

      result.push({
        month: i,
        sales: sale ? sale.sales : 0,
        purchase: purchase ? purchase.purchase : 0
      });

    }

    res.json(result);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ================= PROFIT ================= */

exports.getProfit = async (req, res) => {

  try {

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" }
        }
      }
    ]);

    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalPurchase: { $sum: "$totalAmount" }
        }
      }
    ]);

    const salesTotal = sales[0]?.totalSales || 0;
    const purchaseTotal = purchases[0]?.totalPurchase || 0;

    res.json({
      salesTotal,
      purchaseTotal,
      profit: salesTotal - purchaseTotal
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ================= INVENTORY VALUE ================= */

exports.getInventoryValue = async (req, res) => {

  try {

    const products = await Product.find();

    let total = 0;

    products.forEach(p => {

      total += p.currentStock * p.purchasePrice;

    });

    res.json({
      inventoryValue: total
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ================= STOCK STATUS ================= */

exports.getStockStatus = async (req, res) => {

  try {

    const products = await Product.find();

    const lowStock = products.filter(
      p => p.currentStock <= p.minStockLevel && p.currentStock > 0
    );

    const outStock = products.filter(
      p => p.currentStock === 0
    );

    res.json({
      lowStock: lowStock.length,
      outStock: outStock.length
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


/* ================= ML REORDER ================= */

exports.getReorderML = async (req, res) => {

  try {

    const sales = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          avgSales: { $avg: "$items.quantitySold" }
        }
      }
    ]);

    const products = await Product.find();

    const suggestions = products.map(p => {

      const sale = sales.find(
        s => s._id.toString() === p._id.toString()
      );

      const avgSales = sale ? sale.avgSales : 0;

      const suggestedOrder = Math.max(
        (avgSales * 2) - p.currentStock,
        0
      );

      return {
        productName: p.productName,
        currentStock: p.currentStock,
        suggestedOrder: Math.round(suggestedOrder)
      };

    });

    res.json(suggestions);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.getDeadStock = async (req, res) => {

  try {

    const days = 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const sales = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          lastSold: { $max: "$createdAt" }
        }
      }
    ]);

    const products = await Product.find();

    const deadStock = products.filter(p => {

      const sale = sales.find(
        s => s._id.toString() === p._id.toString()
      );

      if (!sale) return true;

      return new Date(sale.lastSold) < cutoff;

    });

    res.json({
      count: deadStock.length,
      products: deadStock
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.getSalesForecast = async (req, res) => {

  try {

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$grandTotal" }
        }
      }
    ]);

    const total = sales.reduce(
      (sum, s) => sum + s.revenue,
      0
    );

    const avg = total / sales.length;

    res.json({
      forecastNextMonth: Math.round(avg),
      monthsUsed: sales.length
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.getInventoryTurnover = async (req, res) => {

  try {

    const sales = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" }
        }
      }
    ]);

    const products = await Product.find();

    let inventoryValue = 0;

    products.forEach(p => {

      inventoryValue += p.currentStock * p.purchasePrice;

    });

    const totalSales = sales[0]?.totalSales || 0;

    const turnover =
      inventoryValue === 0
        ? 0
        : totalSales / inventoryValue;

    res.json({
      inventoryValue,
      totalSales,
      turnoverRatio: turnover.toFixed(2)
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};