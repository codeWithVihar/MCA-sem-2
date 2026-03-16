import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
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

  const [salesPurchase, setSalesPurchase] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [movement, setMovement] = useState(null);
  const [reorder, setReorder] = useState([]);
  const [deadStock, setDeadStock] = useState([]);
  const [profit, setProfit] = useState({});
  const [inventoryValue, setInventoryValue] = useState(0);
  const [turnover, setTurnover] = useState(0);

  useEffect(() => {

    API.get("/analytics/sales-vs-purchase").then(res =>
      setSalesPurchase(res.data)
    );

    API.get("/sales/monthly").then(res =>
      setMonthly(res.data)
    );

    API.get("/sales/top-products").then(res =>
      setTopProducts(res.data)
    );

    API.get("/sales/movement").then(res =>
      setMovement(res.data)
    );

    API.get("/analytics/reorder-ml").then(res =>
      setReorder(res.data)
    );

    API.get("/analytics/dead-stock").then(res =>
      setDeadStock(res.data.products)
    );

    API.get("/analytics/profit").then(res =>
      setProfit(res.data)
    );

    API.get("/analytics/inventory-value").then(res =>
      setInventoryValue(res.data.inventoryValue)
    );

    API.get("/analytics/inventory-turnover").then(res =>
      setTurnover(res.data.turnoverRatio)
    );

  }, []);

  if (!movement) return <Layout>Loading...</Layout>;

  const movementData = [
    { name: "Fast", value: movement.fastMoving },
    { name: "Slow", value: movement.slowMoving }
  ];

  const COLORS = ["#6366F1", "#EF4444"];

  return (

    <Layout>

      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500">
          Business insights for your inventory
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-400">Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹{profit.salesTotal || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-400">Profit</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{profit.profit || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-400">Inventory Value</p>
          <h2 className="text-2xl font-bold">
            ₹{inventoryValue}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-400">Turnover</p>
          <h2 className="text-2xl font-bold">
            {turnover}x
          </h2>
        </div>

      </div>

      {/* SALES VS PURCHASE */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h3 className="font-semibold mb-4">
          Sales vs Purchase
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <AreaChart data={salesPurchase}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="month"/>

            <YAxis/>

            <Tooltip/>

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              fill="#6366F122"
            />

            <Area
              type="monotone"
              dataKey="purchase"
              stroke="#F59E0B"
              fill="#F59E0B22"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

      {/* REVENUE TREND */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h3 className="font-semibold mb-4">
          Revenue Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={monthly}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="_id"/>

            <YAxis/>

            <Tooltip/>

            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#10B981"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* PRODUCT MOVEMENT */}

      <div className="grid grid-cols-2 gap-8 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Product Movement
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={movementData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                label
              >

                {movementData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]}/>
                ))}

              </Pie>

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* TOP PRODUCTS */}

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Top Products
          </h3>

          <ul>

            {topProducts.map((p, index) => (

              <li
                key={index}
                className="flex justify-between py-2 border-b"
              >

                <span>{p.productName}</span>

                <span className="font-semibold">
                  {p.totalQuantity}
                </span>

              </li>

            ))}

          </ul>

        </div>

      </div>

      {/* DEAD STOCK */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <h3 className="font-semibold mb-4 text-red-500">
          Dead Stock
        </h3>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Stock</th>
            </tr>

          </thead>

          <tbody>

            {deadStock.map((p,index)=>(

              <tr key={index} className="border-b">

                <td className="p-3">{p.productName}</td>

                <td className="p-3">{p.currentStock}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* REORDER */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="font-semibold mb-4">
          AI Reorder Suggestions
        </h3>

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Suggested</th>
            </tr>

          </thead>

          <tbody>

            {reorder.map((item,index)=>(

              <tr key={index} className="border-b">

                <td className="p-3">{item.productName}</td>

                <td className="p-3">{item.currentStock}</td>

                <td className="p-3 font-semibold text-indigo-600">
                  {item.suggestedOrder}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Layout>

  );

};

export default Analytics;