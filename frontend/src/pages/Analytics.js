import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts";

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [movement, setMovement] = useState(null);
  const [reorder, setReorder] = useState([]);

  useEffect(() => {
    API.get("/sales/monthly").then(res => setMonthly(res.data));
    API.get("/sales/top-products").then(res => setTopProducts(res.data));
    API.get("/sales/movement").then(res => setMovement(res.data));
    API.get("/products/reorder").then(res => setReorder(res.data));
  }, []);

  if (!movement) return <Layout><p>Loading...</p></Layout>;

  const movementData = [
    { name: "Fast Moving", value: movement.fastMoving },
    { name: "Slow Moving", value: movement.slowMoving }
  ];

  const COLORS = ["#34D399", "#F87171"];

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-8">
        Business Analytics Dashboard
      </h2>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        {/* Monthly Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#C5BAFF"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalQuantity"
                fill="#C4D9FF"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 gap-8">

        {/* Movement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Product Movement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={movementData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {movementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Reorder Suggestions */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Reorder Suggestions</h3>

          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left">
              <thead className="bg-primary">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Suggested</th>
                </tr>
              </thead>
              <tbody>
                {reorder.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-soft transition"
                  >
                    <td className="p-3">{item.productName}</td>
                    <td className="p-3">{item.currentStock}</td>
                    <td className="p-3 font-semibold">
                      {item.suggestedOrder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Analytics;
