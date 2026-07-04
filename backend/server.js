const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const timeout = require("connect-timeout");

// Route imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");
const saleRoutes = require("./routes/saleRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const salesReturnRoutes = require("./routes/salesReturnRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("New client connected: " + socket.id);
});

// ✅ ENABLE CORS
app.use(cors());

// Security
app.use(helmet());

// Compression
app.use(compression());

// Request timeout
app.use(timeout("30s"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: { message: "Too many requests, please try again later" }
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts, please try again later" }
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);

// Body parser with size limit
app.use(express.json({ limit: "10mb" }));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/sales-return", salesReturnRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/uploads", express.static("uploads"));

// Clear timeout on every response
app.use((req, res, next) => {
  res.on("finish", () => { if (req.clearTimeout) req.clearTimeout(); });
  next();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);