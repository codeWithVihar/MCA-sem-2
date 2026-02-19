import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import CountUp from "react-countup";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStock: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await API.get("/sales/summary");
        const productRes = await API.get("/products");
        const lowStockRes = await API.get("/products/low-stock");
        const monthlyRes = await API.get("/sales/monthly");

        setSummary({
          totalRevenue: salesRes.data.totalRevenue || 0,
          totalSales: salesRes.data.totalSales || 0,
          totalProducts: productRes.data.count || 0,
          lowStock: lowStockRes.data.count || 0,
        });

 

      const formatted = monthlyRes.data.map((item) => ({
  date: new Date(item.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  }),
  revenue: item.totalRevenue,
}));




        setMonthlyData(formatted);

      } catch (err) {
        console.error("Dashboard load error", err);
      }
    };

    fetchData();
  }, []);

  const cardStyle =
    "bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300";

  return (
    <Layout>
      <div className="space-y-8">

        <h2 className="text-2xl font-bold text-gray-700">
          Dashboard Overview
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className={cardStyle}>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-indigo-600 mt-2">
              ₹ <CountUp end={summary.totalRevenue} duration={1.5} separator="," />
            </h3>
          </div>

          <div className={cardStyle}>
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="text-2xl font-bold text-green-600 mt-2">
              <CountUp end={summary.totalSales} duration={1.5} />
            </h3>
          </div>

          <div className={cardStyle}>
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">
              <CountUp end={summary.totalProducts} duration={1.5} />
            </h3>
          </div>

          <div className={cardStyle}>
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <h3 className="text-2xl font-bold text-red-600 mt-2">
              <CountUp end={summary.lowStock} duration={1.5} />
            </h3>
          </div>

        </div>

        {/* Sales Chart */}
     <div className="bg-white p-6 rounded-2xl shadow-sm">
  <h4 className="font-semibold mb-6 text-gray-700">
    Monthly Sales Revenue
  </h4>

  <ResponsiveContainer width="100%" height={320}>
    <AreaChart
      data={monthlyData}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >

      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
          <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
        </linearGradient>
      </defs>

      <XAxis
        dataKey="date"
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={false}
      />

      <YAxis
        tick={{ fontSize: 12 }}
        tickFormatter={(value) => `₹${value.toLocaleString()}`}
        tickLine={false}
        axisLine={false}
      />

      <Tooltip
        contentStyle={{
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
      />

      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#6366F1"
        strokeWidth={3}
        fill="url(#revenueGradient)"
        activeDot={{ r: 6 }}
      />

    </AreaChart>
  </ResponsiveContainer>
</div>



      </div>
    </Layout>
  );
};

export default Dashboard;
