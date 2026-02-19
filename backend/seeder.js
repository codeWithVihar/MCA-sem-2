const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URI);

const products = [
  // ===== POWER TOOLS =====
  {
    productName: "Electric Drill",
    sku: "SKU-001",
    brand: "Bosch",
    category: "Power Tools",
    currentStock: 35,
    minStockLevel: 10,
    purchasePrice: 3200,
    sellingPrice: 4100,
    gstPercent: 18
  },
  {
    productName: "Angle Grinder",
    sku: "SKU-002",
    brand: "Makita",
    category: "Power Tools",
    currentStock: 8,
    minStockLevel: 10,
    purchasePrice: 2800,
    sellingPrice: 3500,
    gstPercent: 18
  },
  {
    productName: "Cordless Screwdriver",
    sku: "SKU-003",
    brand: "Bosch",
    category: "Power Tools",
    currentStock: 0,
    minStockLevel: 5,
    purchasePrice: 2200,
    sellingPrice: 2900,
    gstPercent: 18
  },

  // ===== HAND TOOLS =====
  {
    productName: "Steel Hammer",
    sku: "SKU-004",
    brand: "Tata",
    category: "Hand Tools",
    currentStock: 60,
    minStockLevel: 15,
    purchasePrice: 250,
    sellingPrice: 400,
    gstPercent: 12
  },
  {
    productName: "Adjustable Spanner",
    sku: "SKU-005",
    brand: "Stanley",
    category: "Hand Tools",
    currentStock: 5,
    minStockLevel: 10,
    purchasePrice: 300,
    sellingPrice: 450,
    gstPercent: 12
  },
  {
    productName: "Pliers Set",
    sku: "SKU-006",
    brand: "Taparia",
    category: "Hand Tools",
    currentStock: 40,
    minStockLevel: 10,
    purchasePrice: 350,
    sellingPrice: 550,
    gstPercent: 12
  },

  // ===== ELECTRICAL =====
  {
    productName: "Copper Wire 1mm",
    sku: "SKU-007",
    brand: "Finolex",
    category: "Electrical",
    currentStock: 200,
    minStockLevel: 50,
    purchasePrice: 40,
    sellingPrice: 60,
    gstPercent: 18
  },
  {
    productName: "LED Bulb 12W",
    sku: "SKU-008",
    brand: "Philips",
    category: "Electrical",
    currentStock: 75,
    minStockLevel: 20,
    purchasePrice: 80,
    sellingPrice: 120,
    gstPercent: 18
  },
  {
    productName: "Switch Board",
    sku: "SKU-009",
    brand: "Anchor",
    category: "Electrical",
    currentStock: 0,
    minStockLevel: 10,
    purchasePrice: 150,
    sellingPrice: 250,
    gstPercent: 18
  },

  // ===== PLUMBING =====
  {
    productName: "PVC Pipe 2 inch",
    sku: "SKU-010",
    brand: "Supreme",
    category: "Plumbing",
    currentStock: 120,
    minStockLevel: 30,
    purchasePrice: 150,
    sellingPrice: 220,
    gstPercent: 18
  },
  {
    productName: "Water Tap",
    sku: "SKU-011",
    brand: "Jaguar",
    category: "Plumbing",
    currentStock: 12,
    minStockLevel: 15,
    purchasePrice: 600,
    sellingPrice: 900,
    gstPercent: 18
  },

  // ===== PAINT =====
  {
    productName: "Wall Paint 20L",
    sku: "SKU-012",
    brand: "Asian Paints",
    category: "Paint",
    currentStock: 25,
    minStockLevel: 8,
    purchasePrice: 1800,
    sellingPrice: 2300,
    gstPercent: 18
  },
  {
    productName: "Primer 10L",
    sku: "SKU-013",
    brand: "Nerolac",
    category: "Paint",
    currentStock: 3,
    minStockLevel: 5,
    purchasePrice: 900,
    sellingPrice: 1200,
    gstPercent: 18
  }
];

const updateStockStatus = (product) => {
  if (product.currentStock === 0) {
    product.stockStatus = "OUT_OF_STOCK";
  } else if (product.currentStock <= product.minStockLevel) {
    product.stockStatus = "LOW_STOCK";
  } else {
    product.stockStatus = "IN_STOCK";
  }
};

const seedData = async () => {
  try {
    await Product.deleteMany();

    const updatedProducts = products.map((p) => {
      updateStockStatus(p);
      return p;
    });

    await Product.insertMany(updatedProducts);

    console.log("✅ Hardware Products Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
