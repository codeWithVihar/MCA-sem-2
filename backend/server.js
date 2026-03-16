const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");          // ✅ ONLY ONCE
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const salesReturnRoutes = require("./routes/salesReturnRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");


dotenv.config();
connectDB();

const app = express();

// ✅ ENABLE CORS (open for development)
app.use(cors());

// ✅ BODY PARSER
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/audit", require("./routes/auditRoutes"));
app.use("/api/suppliers", supplierRoutes);
app.use("/api/sales-return", salesReturnRoutes);
app.use("/api/purchases", purchaseRoutes);

const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
