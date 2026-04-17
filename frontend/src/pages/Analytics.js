import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const Analytics = () => {

  const [monthlyData, setMonthlyData] = useState([]);
  const [movement, setMovement] = useState(null);
  const [reorder, setReorder] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [profit, setProfit] = useState({});
  const [inventoryValue, setInventoryValue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const year = new Date().getFullYear();

  /* ================= FETCH ================= */

  useEffect(() => {

    API.get(`/analytics/sales-vs-purchase-month?month=${month}&year=${year}`)
      .then(res => setMonthlyData(res.data));

    API.get("/sales/movement").then(res => setMovement(res.data));
    API.get("/analytics/reorder-ml").then(res => setReorder(res.data));
    API.get("/analytics/dead-stock").then(res => setDeadStock(res.data.products || []));
    API.get("/analytics/profit").then(res => setProfit(res.data));
    API.get("/analytics/inventory-value").then(res => setInventoryValue(res.data.inventoryValue));

    API.get(`/sales/top-products?month=${month}&year=${year}`)
      .then(res => setTopProducts(res.data));

  }, [month]);

  if (!movement) return <Layout>Loading...</Layout>;

  /* ================= HELPERS ================= */

  const formatCurrency = (num) =>
    `₹${Number(num || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2
    })}`;

  const getPriority = (stock, min = 5) => {
    if (stock === 0) return "HIGH";
    if (stock <= min) return "MEDIUM";
    return "LOW";
  };

  /* ================= CALCULATIONS ================= */

  const totalSales = monthlyData.reduce((sum, d) => sum + d.sales, 0);
  const totalPurchase = monthlyData.reduce((sum, d) => sum + d.purchase, 0);
  const totalProfit = totalSales - totalPurchase;

  const movementData = [
    { name: "Fast", value: movement.fastMoving },
    { name: "Slow", value: movement.slowMoving }
  ];

  const COLORS = ["#6366F1", "#EF4444"];

  return (
    <Layout>

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500">Monthly insights</p>
        </div>

        {/* MONTH SELECT */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-4 py-2 border rounded-lg"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white p-6 rounded-xl shadow">
          <p className="text-sm">Sales</p>
          <h2 className="text-2xl font-bold">{formatCurrency(totalSales)}</h2>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-xl shadow">
          <p className="text-sm">Purchase</p>
          <h2 className="text-2xl font-bold">{formatCurrency(totalPurchase)}</h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-xl shadow">
          <p className="text-sm">Profit</p>
          <h2 className="text-2xl font-bold">{formatCurrency(totalProfit)}</h2>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-6 rounded-xl shadow">
          <p className="text-sm">Inventory</p>
          <h2 className="text-2xl font-bold">{formatCurrency(inventoryValue)}</h2>
        </div>

      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h3 className="font-semibold mb-4">
          Daily Sales vs Purchase
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="day"/>
            <YAxis/>
            <Tooltip/>

            <Area type="monotone" dataKey="sales" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2}/>
            <Area type="monotone" dataKey="purchase" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2}/>
          </AreaChart>
        </ResponsiveContainer>

      </div>

      {/* MOVEMENT + TOP */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        {/* MOVEMENT */}
        {/* <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="mb-4 font-semibold">Product Movement</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={movementData} dataKey="value" innerRadius={70} outerRadius={100}>
                {movementData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

        </div> */}

        {/* TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="mb-4 font-semibold">Top Products 🏆</h3>

          {topProducts.slice(0, 3).map((p, i) => (
            <div key={i} className="flex justify-between p-3 hover:bg-indigo-50 rounded-lg">
              <span>{i + 1}. {p.productName}</span>
              <span className="font-bold text-indigo-600">{p.totalQuantity}</span>
            </div>
          ))}

        </div>

      </div>

      {/* REORDER */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h3 className="mb-4 font-semibold">Reorder Suggestions</h3>

        {reorder.map((item, i) => {

          const priority = getPriority(item.currentStock, item.minStockLevel);

          return (
            <div key={i} className="flex justify-between p-3 hover:bg-indigo-50 rounded-lg">

              <div>
                <p>{item.productName}</p>
                <p className="text-xs text-gray-400">Stock: {item.currentStock}</p>
              </div>

              <div>
                <p className="text-indigo-600 font-bold">+{item.suggestedOrder}</p>
                <span className="text-xs">{priority}</span>
              </div>

            </div>
          );

        })}

      </div>

      {/* DEAD STOCK */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="mb-4 text-red-500 font-semibold">Dead Stock</h3>

        {deadStock.length === 0 && (
          <p className="text-gray-400">No dead stock 🎉</p>
        )}

        {deadStock.map((p, i) => (
          <div key={i} className="flex justify-between p-3 hover:bg-red-50 rounded-lg">
            <span>{p.productName}</span>
            <span className="text-red-600">{p.currentStock}</span>
          </div>
        ))}

      </div>

    </Layout>
  );
};

export default Analytics;