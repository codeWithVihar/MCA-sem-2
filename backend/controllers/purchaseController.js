const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

exports.createPurchase = async (req, res) => {

  try {

    let supplierId = req.body.supplierId;
    let productId = req.body.productId;

    const {
      supplierMode,
      productMode,
      quantity,
      purchasePrice
    } = req.body;

    /* ---------------- CREATE SUPPLIER ---------------- */

   if (supplierMode === "new") {

  const supplier = await Supplier.create({

    supplierName: req.body.supplierName,   // ✅ correct field
    email: req.body.supplierEmail,
    phone: req.body.supplierPhone

  });

  supplierId = supplier._id;

}
    /* ---------------- CREATE PRODUCT ---------------- */

    if (productMode === "new") {

      const product = await Product.create({

        productName: req.body.productName,
        brand: req.body.brand,
        category: req.body.category,
        sku: req.body.sku,
        unit: req.body.unit,

        purchasePrice: req.body.purchasePrice,
        sellingPrice: req.body.sellingPrice,

        gstPercent: req.body.gstPercent,
        discountPercent: req.body.discountPercent,
        minStockLevel: req.body.minStockLevel,

        returnable: req.body.returnable,
        damageProne: req.body.damageProne,
        hazardous: req.body.hazardous,

        currentStock: 0

      });

      productId = product._id;

    }

    /* ---------------- FIND PRODUCT ---------------- */

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    /* ---------------- UPDATE STOCK ---------------- */

    product.currentStock += Number(quantity);

    await product.save();

    const total = quantity * purchasePrice;

    /* ---------------- CREATE PURCHASE ---------------- */

    const purchase = await Purchase.create({

      supplier: supplierId,

      items: [
        {
          product: productId,
          quantity,
          purchasePrice,
          total
        }
      ],

      totalAmount: total

    });

    res.status(201).json({

      success: true,
      purchase

    });

  } catch (error) {



    res.status(500).json({
      message: error.message
    });

  }

};