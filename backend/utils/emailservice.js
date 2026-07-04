const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");

const getTransporter = () => nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendLowStockEmail = async (product) => {

  try {

    const admins = await User.find({ role: "Admin", isActive: true });
    if (!admins.length) return;

    const shortfall = Math.max(0, (product.minStockLevel || 0) - product.currentStock);
    const suggestedQty = product.minStockLevel * 2 - product.currentStock;
    const atLoss = product.currentStock === 0;

    const adminEmails = admins.map(a => a.email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmails.join(","),
      subject: `${atLoss ? "⛔ OUT OF STOCK" : "⚠ LOW STOCK"}: ${product.productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${atLoss ? "#dc2626" : "#f59e0b"}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 22px;">${atLoss ? "⛔ Out of Stock" : "⚠ Low Stock Alert"}</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">${product.productName}</p>
          </div>

          <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 15px;">Product Details</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Product</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;"><b>${product.productName}</b></td>
              </tr>
              ${product.category ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Category</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.category}</td></tr>` : ''}
              ${product.brand ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Brand</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.brand}</td></tr>` : ''}
              ${product.sku ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">SKU</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.sku}</td></tr>` : ''}
              ${product.unit ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Unit</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.unit}</td></tr>` : ''}
            </table>

            <h2 style="color: #1f2937; font-size: 18px; margin: 20px 0 15px;">Stock Status</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Current Stock</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;"><b style="color: ${atLoss ? "#dc2626" : "#f59e0b"};">${product.currentStock}</b></td>
              </tr>
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Min Stock Level</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.minStockLevel}</td>
              </tr>
              ${product.maxStockLevel ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Max Stock Level</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">${product.maxStockLevel}</td></tr>` : ''}
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Status</td>
                <td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">
                  <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; background: ${atLoss ? "#fef2f2" : "#fffbeb"}; color: ${atLoss ? "#dc2626" : "#d97706"};">
                    ${product.stockStatus}
                  </span>
                </td>
              </tr>
              ${product.sellingPrice ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Selling Price</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">₹${Number(product.sellingPrice).toFixed(2)}</td></tr>` : ''}
              ${product.purchasePrice ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Purchase Price</td><td style="padding: 8px 10px; border-bottom: 1px solid #f3f4f6; font-size: 13px;">₹${Number(product.purchasePrice).toFixed(2)}</td></tr>` : ''}
            </table>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin-top: 20px;">
              <h3 style="color: #16a34a; margin: 0 0 10px; font-size: 16px;">📦 Restock Suggestion</h3>
              ${shortfall > 0 ? `<p style="margin: 5px 0; color: #374151; font-size: 13px;"><b>Shortfall:</b> ${shortfall} ${product.unit || "units"} below minimum</p>` : ''}
              <p style="margin: 5px 0; color: #374151; font-size: 13px;"><b>Suggested order quantity:</b> ${suggestedQty} ${product.unit || "units"}</p>
              ${product.sellingPrice && product.purchasePrice ? `<p style="margin: 5px 0; color: #374151; font-size: 13px;"><b>Estimated cost:</b> ₹${(suggestedQty * Number(product.purchasePrice)).toFixed(2)}</p>` : ''}
            </div>

            <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 20px;">
              This is an automated alert from your Inventory Management System.
            </p>
          </div>
        </div>
      `
    };

    await getTransporter().sendMail(mailOptions);

  } catch (error) {

    console.error("Email error:", error);

  }

};

module.exports = sendLowStockEmail;