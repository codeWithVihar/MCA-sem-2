const Order = require("../models/Order");
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const updateStockStatus = require("../utils/stockHelper");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");
/* ================= EMAIL SETUP ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= GENERATE INVOICE PDF ================= */

const generateInvoicePDF = (sale, order) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    const buffers = [];

    /* ================= REGISTER FONTS ================= */

    doc.registerFont(
      "Regular",
      path.join(__dirname, "../fonts/NotoSans-Regular.ttf")
    );

    doc.registerFont(
      "Bold",
      path.join(__dirname, "../fonts/NotoSans-Bold.ttf")
    );

    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    /* ================= HEADER ================= */

    doc
      .rect(0, 0, 595, 120)
      .fill("#4F46E5");

    doc
      .fillColor("white")
      .font("Bold")
      .fontSize(26)
      .text("SMART INVENTORY SYSTEM", 50, 35);

    doc
      .font("Regular")
      .fontSize(12)
      .text("Hardware Store", 52, 68)
      .text("GSTIN: 22AAAAA0000A1Z5", 52, 85);

    doc
      .font("Bold")
      .fontSize(24)
      .text("INVOICE", 380, 40, {
        width: 150,
        align: "right"
      });

    doc
      .font("Regular")
      .fontSize(11)
      .text(`Invoice No: ${sale.invoiceNumber}`, 350, 75, {
        width: 180,
        align: "right"
      });

    doc.text(
      `Date: ${new Date(sale.createdAt).toLocaleDateString()}`,
      350,
      92,
      {
        width: 180,
        align: "right"
      }
    );

    /* ================= CUSTOMER BOX ================= */

    doc
      .roundedRect(50, 145, 495, 90, 8)
      .fillAndStroke("#F3F4F6", "#E5E7EB");

    doc
      .fillColor("#111827")
      .font("Bold")
      .fontSize(13)
      .text("Customer Details", 65, 160);

    doc
      .font("Regular")
      .fontSize(11)
      .text(`Name: ${order.customerName || "-"}`, 65, 185)
      .text(`Phone: ${order.customerPhone || "-"}`, 65, 202);

    doc.text(
      `Email: ${order.customerEmail || "-"}`,
      300,
      185
    );

    doc.text(
      `Address: ${order.customerAddress || "-"}`,
      300,
      202,
      {
        width: 220
      }
    );

    /* ================= ITEMS TABLE ================= */

    const tableTop = 270;
    const rowHeight = 30;

    doc
      .rect(50, tableTop, 495, rowHeight)
      .fill("#6366F1");

    doc
      .fillColor("white")
      .font("Bold")
      .fontSize(11)
      .text("Product", 60, tableTop + 9)
      .text("Qty", 240, tableTop + 9)
      .text("Price", 290, tableTop + 9)
      .text("GST", 370, tableTop + 9)
      .text("Total", 455, tableTop + 9);

    let y = tableTop + rowHeight;

    sale.items.forEach((item, index) => {
      doc
        .rect(50, y, 495, rowHeight)
        .fill(index % 2 === 0 ? "#F9FAFB" : "#FFFFFF");

      doc
        .fillColor("#111827")
        .font("Regular")
        .fontSize(10)
        .text(
          item.product?.productName || "Product",
          60,
          y + 9,
          {
            width: 160
          }
        );

      doc.text(
        item.quantitySold.toString(),
        245,
        y + 9
      );

      doc.text(
        `₹${item.sellingPrice}`,
        265,
        y + 9,
        {
          width: 70,
          align: "right"
        }
      );

      doc.text(
        `₹${item.gstAmount}`,
        345,
        y + 9,
        {
          width: 70,
          align: "right"
        }
      );

      doc.text(
        `₹${item.totalAmount}`,
        430,
        y + 9,
        {
          width: 90,
          align: "right"
        }
      );

      y += rowHeight;
    });

    /* ================= TOTAL BOX ================= */

    y += 25;

    doc
      .roundedRect(335, y, 210, 95, 8)
      .fillAndStroke("#F3F4F6", "#E5E7EB");

    doc
      .fillColor("#111827")
      .font("Regular")
      .fontSize(11)
      .text("Subtotal:", 350, y + 18);

    doc.text(
      `₹${sale.totalSubAmount}`,
      440,
      y + 18,
      {
        width: 85,
        align: "right"
      }
    );

    doc.text("GST:", 350, y + 42);

    doc.text(
      `₹${sale.totalGSTAmount}`,
      440,
      y + 42,
      {
        width: 85,
        align: "right"
      }
    );

    doc
      .moveTo(350, y + 66)
      .lineTo(525, y + 66)
      .strokeColor("#D1D5DB")
      .stroke();

    doc
      .font("Bold")
      .fontSize(15)
      .text("Grand Total:", 350, y + 75);

    doc.text(
      `₹${sale.grandTotal}`,
      425,
      y + 75,
      {
        width: 100,
        align: "right"
      }
    );

    /* ================= FOOTER ================= */

    doc
      .font("Regular")
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        "Thank you for shopping with Smart Inventory System",
        50,
        760,
        {
          width: 495,
          align: "center"
        }
      );

    doc.end();
  });
};
/* ================= CREATE ORDER ================= */

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress
    } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      const total = product.sellingPrice * item.quantity;
      totalAmount += total;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.sellingPrice
      });
    }

    const order = await Order.create({
      items: orderItems,
      totalAmount,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      status: "PENDING"
    });

    if (global.io) {
      global.io.emit("new-order", order);
    }

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= GET ALL ORDERS ================= */
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "PENDING"
    })
      .populate("items.product", "productName sellingPrice")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "productName sellingPrice")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= DISPATCH ORDER ================= */

exports.dispatchOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({
        message: "Only pending orders can be dispatched"
      });
    }

    let totalSubAmount = 0;
    let totalGSTAmount = 0;
    const saleItems = [];

    for (const item of order.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      if (product.currentStock < item.quantity) {
        return res.status(400).json({
          message: `Low stock for ${product.productName}`
        });
      }

      const subTotal = product.sellingPrice * item.quantity;
      const gstAmount =
        (subTotal * (product.gstPercent || 0)) / 100;
      const totalAmount = subTotal + gstAmount;

      totalSubAmount += subTotal;
      totalGSTAmount += gstAmount;

      saleItems.push({
        product: product._id,
        quantitySold: item.quantity,
        sellingPrice: product.sellingPrice,
        subTotal,
        gstPercent: product.gstPercent || 0,
        gstAmount,
        totalAmount
      });

      /* UPDATE STOCK */
      product.currentStock -= item.quantity;
      await updateStockStatus(product, false);
      await product.save();
    }

    /* CREATE SALE */
    let sale = await Sale.create({
      invoiceNumber: "INV-" + Date.now(),
      items: saleItems,
      totalSubAmount,
      totalGSTAmount,
      grandTotal: totalSubAmount + totalGSTAmount
    });

    /* Populate products for PDF */
    sale = await Sale.findById(sale._id)
      .populate("items.product", "productName");

    /* UPDATE ORDER */
    order.status = "DISPATCHED";
    order.sale = sale._id;
    order.dispatchedAt = new Date();

    await order.save();

    /* SEND EMAIL */
    if (order.customerEmail) {
      try {
        const pdfBuffer = await generateInvoicePDF(sale, order);

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: order.customerEmail,
          subject: `Invoice ${sale.invoiceNumber} - Order Dispatched`,
          html: `
            <div style="font-family:Arial;padding:20px">
              <h2>Hello ${order.customerName},</h2>
              <p>Your order has been dispatched successfully.</p>
              <p>Please find your invoice attached.</p>
              <p><b>Invoice Number:</b> ${sale.invoiceNumber}</p>
              <br/>
              <p>Thank you for shopping with us.</p>
            </div>
          `,
          attachments: [
            {
              filename: `${sale.invoiceNumber}.pdf`,
              content: pdfBuffer
            }
          ]
        });
      } catch (emailError) {
        console.error("Email send failed (non-fatal):", emailError.message);
      }
    }

    if (global.io) {
      global.io.emit("order-dispatched", order);
    }

    res.json({
      success: true,
      message: order.customerEmail
        ? "Order dispatched and invoice emailed successfully"
        : "Order dispatched successfully, but customer email not found",
      sale
    });

  } catch (error) {
    console.error("DISPATCH ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= COMPLETE ORDER ================= */

exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status !== "DISPATCHED") {
      return res.status(400).json({
        message: "Only dispatched orders can be completed"
      });
    }

    order.status = "COMPLETED";
    order.completedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Order completed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= REJECT ORDER ================= */

exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true }
    );

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* ================= CUSTOMER ORDERS ================= */

exports.getCustomerOrders = async (req, res) => {
  try {
    const { phone } = req.params;

    const orders = await Order.find({
      customerPhone: phone
    })
      .populate("items.product", "productName sellingPrice")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};