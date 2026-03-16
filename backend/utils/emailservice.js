const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLowStockEmail = async (product) => {

  try {

    // Get all admins
    const admins = await User.find({ role: "Admin", isActive: true });

    if (!admins.length) return;

    const adminEmails = admins.map(a => a.email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails.join(","),   // send to all admins
      subject: `⚠ Stock Alert: ${product.productName}`,
      html: `
        <h2>Low Stock Alert</h2>

        <p><b>Product:</b> ${product.productName}</p>
        <p><b>Current Stock:</b> ${product.currentStock}</p>
        <p><b>Minimum Level:</b> ${product.minStockLevel}</p>
        <p><b>Status:</b> ${product.stockStatus}</p>

        <br/>

        <p>Please restock this product as soon as possible.</p>
      `
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {

    console.error("Email error:", error);

  }

};

module.exports = sendLowStockEmail;