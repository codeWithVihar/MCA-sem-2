import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import LoadingBox from "../components/ui/LoadingBox";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
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
          totalRevenue: salesRes.data?.totalRevenue ?? 0,
          totalSales: salesRes.data?.totalSales ?? 0,
          totalProducts: productRes.data?.count ?? 0,
          lowStock: lowStockRes.data?.count ?? 0,
        });

        const formatted = monthlyRes.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          revenue: item.totalRevenue,
        }));
        setMonthlyData(formatted);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpiCards = [
    {
      title: "Total Revenue",
      value: summary.totalRevenue,
      prefix: "₹",
      icon: <TrendingUp size={22} />,
      gradient: "from-indigo-500 to-indigo-400",
      iconBg: "bg-indigo-600/20",
    },
    {
      title: "Total Sales",
      value: summary.totalSales,
      icon: <ShoppingBag size={22} />,
      gradient: "from-emerald-500 to-emerald-400",
      iconBg: "bg-emerald-600/20",
    },
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: <Package size={22} />,
      gradient: "from-blue-500 to-blue-400",
      iconBg: "bg-blue-600/20",
    },
    {
      title: "Low Stock",
      value: summary.lowStock,
      icon: <AlertTriangle size={22} />,
      gradient: "from-rose-500 to-rose-400",
      iconBg: "bg-rose-600/20",
    },
  ];

  if (loading) return <Layout><LoadingBox text="Loading dashboard..." /></Layout>;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-400 mt-1">
            Track your inventory performance at a glance
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {kpiCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${card.gradient} text-white p-5 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-white/80 font-medium">{card.title}</p>
                <div className={`${card.iconBg} p-2 rounded-xl`}>
                  {card.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold">
                {card.prefix || ""}
                <CountUp end={card.value} duration={1.5} separator="," />
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-semibold text-gray-800">Monthly Sales Revenue</h4>
              <p className="text-sm text-gray-400">Daily revenue breakdown</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                tickFormatter={(v) => `₹${v.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, fill: "#6366F1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;
