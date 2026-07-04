const mongoose = require("mongoose");
require("dotenv").config();
const Sale = require("./models/Sale");
const Purchase = require("./models/Purchase");
const Product = require("./models/Product");
const Supplier = require("./models/Supplier");

const connectDB = require("./config/db");

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// Price lookup for common hardware store items — maps product name to realistic selling & purchase prices
const PRODUCT_PRICES = {
  "Electric Drill": { price: 4100, purchase: 3200 },
  "Angle Grinder": { price: 3500, purchase: 2800 },
  "Cordless Screwdriver": { price: 2900, purchase: 2200 },
  "Steel Hammer": { price: 400, purchase: 250 },
  "Adjustable Spanner": { price: 450, purchase: 300 },
  "Pliers Set": { price: 550, purchase: 350 },
  "Copper Wire 1mm": { price: 60, purchase: 40 },
  "LED Bulb 12W": { price: 120, purchase: 80 },
  "Switch Board": { price: 250, purchase: 150 },
  "PVC Pipe 2 inch": { price: 220, purchase: 150 },
  "Water Tap": { price: 900, purchase: 600 },
  "Wall Paint 20L": { price: 2300, purchase: 1800 },
  "Primer 10L": { price: 1200, purchase: 900 },
  "Screwdriver Set": { price: 180, purchase: 110 },
  "Measuring Tape 5m": { price: 85, purchase: 50 },
  "Utility Knife": { price: 120, purchase: 70 },
  "Sandpaper Pack": { price: 45, purchase: 25 },
  "Nails 1kg": { price: 90, purchase: 55 },
  "Screws Pack 100": { price: 65, purchase: 38 },
  "Wire Connector 10pk": { price: 35, purchase: 18 },
  "Electrical Tape": { price: 40, purchase: 22 },
  "PVC Glue 100ml": { price: 160, purchase: 100 },
  "Door Hinge Set": { price: 320, purchase: 210 },
  "Cabinet Handle": { price: 85, purchase: 50 },
  "Wall Plug Pack 50": { price: 55, purchase: 30 },
  "Paint Brush 4inch": { price: 180, purchase: 110 },
  "Roller Brush Set": { price: 250, purchase: 160 },
  "Spray Paint 400ml": { price: 220, purchase: 145 },
  "Masking Tape 50m": { price: 95, purchase: 58 },
  "Safety Goggles": { price: 150, purchase: 90 },
  "Work Gloves Pair": { price: 110, purchase: 65 },
  "Dust Mask Pack 10": { price: 130, purchase: 80 },
  "Extension Cord 10m": { price: 650, purchase: 420 },
  "Multi-plug Socket": { price: 280, purchase: 180 },
  "Battery AAA 4pk": { price: 140, purchase: 85 },
  "Battery AA 4pk": { price: 120, purchase: 72 },
  "Flashlight LED": { price: 350, purchase: 220 },
  "Chisel Set 3pc": { price: 420, purchase: 280 },
  "Hand Saw 12inch": { price: 380, purchase: 240 },
  "Tool Box Plastic": { price: 750, purchase: 500 },
};

const seedSalesHistory = async () => {
  try {
    await connectDB();

    const existingSales = await Sale.countDocuments();
    if (existingSales > 50) {
      console.log(`Already have ${existingSales} sales records. Skipping sales seeding.`);
    } else {
      console.log("Seeding 6 months of realistic sales history (~₹10,000/day)...");
      const products = await Product.find();
      if (products.length === 0) {
        console.log("No products found. Run seeder.js first.");
        process.exit(1);
      }

      const now = new Date();
      const salesBatch = [];
      const purchaseBatch = [];

      // Build price map for existing DB products
      const productPriceMap = {};
      products.forEach((p) => {
        const info = PRODUCT_PRICES[p.productName] || { price: p.sellingPrice || 100, purchase: p.purchasePrice || 50 };
        productPriceMap[p._id.toString()] = { name: p.productName, price: info.price, purchase: info.purchase };
      });

      // Categorize products into cheap, medium, expensive for realistic basket composition
      const cheapIds = products.filter(p => (productPriceMap[p._id.toString()]?.price || 999) < 200).map(p => p._id.toString());
      const mediumIds = products.filter(p => {
        const pr = productPriceMap[p._id.toString()]?.price || 999;
        return pr >= 200 && pr < 1000;
      }).map(p => p._id.toString());
      const expensiveIds = products.filter(p => (productPriceMap[p._id.toString()]?.price || 0) >= 1000).map(p => p._id.toString());

      for (let dayOffset = 180; dayOffset >= 0; dayOffset--) {
        const date = new Date(now);
        date.setDate(date.getDate() - dayOffset);
        const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

        // Sundays: store closed or half-day (70% skip)
        if (dayOfWeek === 0 && Math.random() < 0.7) continue;

        // Decide how many transactions today — target ~₹10,000 total
        // Weekday: 4-10 transactions, Weekend (Sat): 2-5
        const isWeekend = dayOfWeek === 6;
        const numTransactions = isWeekend ? randomInt(3, 6) : randomInt(5, 11);

        // Daily total target with realistic variance
        const dailyTarget = 9000 + randomInt(-2000, 4000);
        let dailyTotal = 0;
        let daySales = 0;

        for (let t = 0; t < numTransactions; t++) {
          // Spread transactions throughout the day (9 AM - 7 PM)
          const hour = 9 + randomInt(0, 9);
          const minute = randomInt(0, 59);
          const saleDate = new Date(date);
          saleDate.setHours(hour, minute, randomInt(0, 59), 0);

          // Build a realistic basket of items
          const numItems = randomInt(1, 5);
          const items = [];
          let totalSubAmount = 0;
          let totalGSTAmount = 0;

          // 15% chance of a "big" basket (contractor/handyman) with an expensive tool + small items
          const isBigSale = Math.random() < 0.18 && expensiveIds.length > 0;

          const selectedIds = [];

          if (isBigSale) {
            // 1 expensive item
            const eid = expensiveIds[randomInt(0, expensiveIds.length - 1)];
            selectedIds.push(eid);
            // 0-2 medium items
            const numMed = randomInt(0, 2);
            for (let m = 0; m < numMed && mediumIds.length > 0; m++) {
              selectedIds.push(mediumIds[randomInt(0, mediumIds.length - 1)]);
            }
            // 0-1 cheap items
            const numCheap = randomInt(0, 1);
            for (let c = 0; c < numCheap && cheapIds.length > 0; c++) {
              selectedIds.push(cheapIds[randomInt(0, cheapIds.length - 1)]);
            }
          } else {
            // Regular customer: 1-3 items, mostly cheap
            const numMedium = Math.random() < 0.2 ? 1 : 0;
            const numCheap = randomInt(1, 3);
            for (let m = 0; m < numMedium && mediumIds.length > 0; m++) {
              selectedIds.push(mediumIds[randomInt(0, mediumIds.length - 1)]);
            }
            for (let c = 0; c < numCheap && cheapIds.length > 0; c++) {
              selectedIds.push(cheapIds[randomInt(0, cheapIds.length - 1)]);
            }
          }

          // Remove duplicates
          const uniqueIds = [...new Set(selectedIds)];

          for (const pid of uniqueIds) {
            const info = productPriceMap[pid];
            if (!info) continue;

            // Quantity varies by price: expensive items sell 1, cheap items sell 1-5
            let qty;
            if (info.price >= 1000) qty = 1;
            else if (info.price >= 200) qty = randomInt(1, 3);
            else qty = randomInt(1, 5);

            const price = info.price;
            const gstPercent = 18;
            const subTotal = qty * price;
            const gstAmount = (subTotal * gstPercent) / 100;
            const totalAmount = subTotal + gstAmount;

            items.push({
              product: new mongoose.Types.ObjectId(pid),
              quantitySold: qty,
              sellingPrice: price,
              subTotal,
              gstPercent,
              gstAmount,
              totalAmount,
            });

            totalSubAmount += subTotal;
            totalGSTAmount += gstAmount;
          }

          if (items.length === 0) continue;

          const grandTotal = totalSubAmount + totalGSTAmount;
          dailyTotal += grandTotal;
          daySales++;

          salesBatch.push({
            invoiceNumber: `INV-${date.getTime()}-${t}`,
            items,
            totalSubAmount,
            totalGSTAmount,
            grandTotal,
            createdAt: saleDate,
            updatedAt: saleDate,
          });
        }

        // Cap daily total at ₹18,000 — trim excess transactions if needed
        if (dailyTotal > 18000) {
          const excess = dailyTotal - 18000;
          const removed = salesBatch.splice(-Math.ceil(excess / 3000));
          dailyTotal -= removed.reduce((s, r) => s + r.grandTotal, 0);
        }

        // If we're under ₹3,000, add a small top-up sale
        if (dailyTotal < 3000 && daySales > 0 && cheapIds.length > 0) {
          const saleDate = new Date(date);
          saleDate.setHours(18, randomInt(0, 59), 0, 0);
          const items = [];
          let ts = 0, tg = 0;
          const numCheap = randomInt(2, 5);
          for (let c = 0; c < numCheap && cheapIds.length > 0; c++) {
            const pid = cheapIds[randomInt(0, cheapIds.length - 1)];
            const info = productPriceMap[pid];
            if (!info) continue;
            const qty = randomInt(1, 4);
            const st = qty * info.price;
            const gst = (st * 18) / 100;
            items.push({ product: new mongoose.Types.ObjectId(pid), quantitySold: qty, sellingPrice: info.price, subTotal: st, gstPercent: 18, gstAmount: gst, totalAmount: st + gst });
            ts += st; tg += gst;
          }
          if (items.length > 0) {
            salesBatch.push({ invoiceNumber: `INV-${date.getTime()}-topup`, items, totalSubAmount: ts, totalGSTAmount: tg, grandTotal: ts + tg, createdAt: saleDate, updatedAt: saleDate });
          }
        }
      }

      if (salesBatch.length) {
        // Insert in chunks to avoid memory issues
        const CHUNK = 1000;
        for (let i = 0; i < salesBatch.length; i += CHUNK) {
          await Sale.insertMany(salesBatch.slice(i, i + CHUNK));
        }
        console.log(`Inserted ${salesBatch.length} sales records across 6 months`);
      }

      // Generate purchase records — quantities are ~60-70% of monthly sales (typical COGS)
      console.log("Generating purchase records...");
      const supplier = await Supplier.findOne().sort({ _id: 1 });
      for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
        const numPurchases = randomInt(2, 3);
        for (let p = 0; p < numPurchases; p++) {
          const maxDay = monthOffset === 0 ? now.getDate() : 25;
          const purchaseDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, Math.min(randomInt(3, 25), maxDay));
          purchaseDate.setHours(10, 0, 0, 0);
          const purchaseItems = [];
          let totalAmount = 0;
          const numProducts = randomInt(2, 5);
          const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, numProducts);
          for (const product of shuffled) {
            const info = productPriceMap[product._id.toString()];
            if (!info) continue;
            // Purchase in smaller batches — just enough to restock ~2 weeks of sales
            const qty = randomInt(3, 12);
            const cost = info.purchase * qty;
            purchaseItems.push({ product: product._id, quantity: qty, purchasePrice: info.purchase, total: cost });
            totalAmount += cost;
          }
          if (supplier) {
            purchaseBatch.push({
              supplier: supplier._id,
              items: purchaseItems,
              totalAmount,
              purchaseDate,
              createdAt: purchaseDate,
              updatedAt: purchaseDate,
            });
          }
        }
      }

      if (purchaseBatch.length) {
        await Purchase.insertMany(purchaseBatch);
        console.log(`Inserted ${purchaseBatch.length} purchase records`);
      }

      // Verify daily averages
      const totalSalesAmount = salesBatch.reduce((s, r) => s + r.grandTotal, 0);
      const uniqueDays = new Set(salesBatch.map(r => new Date(r.createdAt).toDateString())).size;
      console.log(`Average daily sales: ₹${Math.round(totalSalesAmount / uniqueDays)}`);
    }

    // Update suppliers with rating and deliveryTimeDays
    const suppliers = await Supplier.find();
    for (const s of suppliers) {
      s.rating = randomInt(2, 5);
      s.deliveryTimeDays = randomInt(3, 14);
      await s.save();
    }
    console.log(`Updated ${suppliers.length} suppliers with rating/delivery data`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedSalesHistory();
