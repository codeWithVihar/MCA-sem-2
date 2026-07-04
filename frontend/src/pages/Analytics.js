import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

import { formatCurrency } from "../utils/formatters";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  TrendingUp, DollarSign, Package, BarChart3, Sparkles,
  ShoppingCart, AlertTriangle, Activity, Star,
} from "lucide-react";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "forecasts", label: "AI Forecasts" },
  { key: "insights", label: "AI Insights" },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [monthlyData, setMonthlyData] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  const [aiDashboard, setAiDashboard] = useState(null);
  const [aiSalesPred, setAiSalesPred] = useState(null);
  const [aiDemand, setAiDemand] = useState([]);
  const [aiRestock, setAiRestock] = useState([]);
  const [aiStockout, setAiStockout] = useState([]);
  const [aiMovement, setAiMovement] = useState(null);
  const [aiProfit, setAiProfit] = useState(null);
  const [aiSuppliers, setAiSuppliers] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    setDataLoaded(false);
    Promise.allSettled([
      API.get(`/analytics/sales-vs-purchase-month?month=${month}&year=${year}`).then((r) => setMonthlyData(r.data)),
      API.get("/analytics/inventory-value").then((r) => setInventoryValue(r.data.inventoryValue)),
      API.get(`/sales/top-products?month=${month}&year=${year}`).then((r) => setTopProducts(r.data)),
    ]).finally(() => setDataLoaded(true));
  }, [month, year]);

  useEffect(() => {
    const fetchAI = async () => {
      setAiLoading(true);
      try {
        const [dash, pred, demand, restock, stockout, movementData, profit, supp] = await Promise.allSettled([
          API.get("/ai/dashboard").then(r => r.data),
          API.get("/ai/sales-prediction").then(r => r.data),
          API.get("/ai/demand-forecast").then(r => r.data),
          API.get("/ai/restock").then(r => r.data),
          API.get("/ai/stockout").then(r => r.data),
          API.get("/ai/fast-moving").then(r => r.data),
          API.get("/ai/profit").then(r => r.data),
          API.get("/ai/supplier").then(r => r.data),
        ]);

        if (dash.status === "fulfilled") setAiDashboard(dash.value);
        if (pred.status === "fulfilled") setAiSalesPred(pred.value);
        if (demand.status === "fulfilled") setAiDemand(demand.value.products || []);
        if (restock.status === "fulfilled") setAiRestock(restock.value.recommendations || []);
        if (stockout.status === "fulfilled") setAiStockout(stockout.value.products || []);
        if (movementData.status === "fulfilled") setAiMovement(movementData.value);
        if (profit.status === "fulfilled") setAiProfit(profit.value);
        if (supp.status === "fulfilled") setAiSuppliers(supp.value.suppliers || []);
      } catch (e) {
        console.log("AI service not available");
      }
      setAiLoading(false);
    };
    fetchAI();
  }, []);

  if (!dataLoaded) return <Layout><div className="flex items-center justify-center h-64 text-gray-400">Loading analytics...</div></Layout>;

  const totalSales = monthlyData.reduce((sum, d) => sum + d.sales, 0);
  const totalPurchase = monthlyData.reduce((sum, d) => sum + d.purchase, 0);
  const totalProfit = totalSales - totalPurchase;

  const todayActual = monthlyData.length > 0 ? (monthlyData[new Date().getDate() - 1]?.sales || 0) : 0;
  const tomorrowPred = aiSalesPred?.tomorrow?.predicted_sales || 0;
  const weeklyPred = aiSalesPred?.weekly?.reduce((s, r) => s + (typeof r === "object" ? r.predicted_sales : r), 0) || 0;
  const monthlyPred = aiSalesPred?.monthly?.reduce((s, r) => s + (typeof r === "object" ? r.predicted_sales : r), 0) || 0;
  const expectedProfit = aiProfit?.nextMonthProfit || 0;
  const restockCount = aiRestock.filter(r => r.recommendedQty > 0).length;
  const stockoutAlerts = aiStockout.filter(r => r.daysUntilStockout < 30).length;
  const healthScore = aiDashboard?.health?.score ?? null;

  const kpiCards = [
    { title: "Sales", value: totalSales, icon: <TrendingUp size={20} />, gradient: "from-indigo-500 to-indigo-400" },
    { title: "Purchase", value: totalPurchase, icon: <DollarSign size={20} />, gradient: "from-amber-500 to-amber-400" },
    { title: "Profit", value: totalProfit, icon: <BarChart3 size={20} />, gradient: "from-emerald-500 to-emerald-400" },
    { title: "Inventory", value: inventoryValue, icon: <Package size={20} />, gradient: "from-purple-500 to-purple-400" },
  ];

  const aiKpiCards = [
    { title: "Today's Sales", value: todayActual, icon: <TrendingUp size={18} />, gradient: "from-indigo-500 to-indigo-400" },
    { title: "Tomorrow", value: tomorrowPred, icon: <Sparkles size={18} />, gradient: "from-violet-500 to-violet-400", ai: true },
    { title: "Weekly", value: weeklyPred, icon: <Sparkles size={18} />, gradient: "from-blue-500 to-blue-400", ai: true },
    { title: "Monthly", value: monthlyPred, icon: <Sparkles size={18} />, gradient: "from-cyan-500 to-cyan-400", ai: true },
    { title: "Expected Profit", value: expectedProfit, icon: <Activity size={18} />, gradient: "from-emerald-500 to-emerald-400", ai: true },
    { title: "To Restock", value: restockCount, icon: <ShoppingCart size={18} />, gradient: "from-amber-500 to-amber-400", ai: true },
    { title: "Stock-Out", value: stockoutAlerts, icon: <AlertTriangle size={18} />, gradient: "from-rose-500 to-rose-400", ai: true },
  ];

  const gaugeValue = healthScore !== null ? Math.round(healthScore) : 0;

  const stockoutColor = (days) => {
    if (days >= 60) return "#10B981";
    if (days >= 30) return "#F59E0B";
    return "#EF4444";
  };

  const renderTab = (key) => (
    <button
      key={key}
      onClick={() => setActiveTab(key)}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
        activeTab === key
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      {key === "forecasts" || key === "insights" ? <><Sparkles size={14} className="inline mr-1.5 -mt-0.5" />{key === "forecasts" ? "AI Forecasts" : "AI Insights"}</> : key.charAt(0).toUpperCase() + key.slice(1)}
    </button>
  );

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">Monthly insights & AI-powered predictions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {TABS.map(t => renderTab(t.key))}
            </div>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-4 gap-5">
              {kpiCards.map((card) => (
                <div key={card.title} className={"bg-gradient-to-br " + card.gradient + " text-white p-5 rounded-2xl shadow-card"}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-white/80">{card.title}</p>
                    <div className="bg-white/20 p-2 rounded-xl">{card.icon}</div>
                  </div>
                  <h2 className="text-2xl font-bold">{formatCurrency(card.value)}</h2>
                </div>
              ))}
            </div>

            {!aiLoading && (
              <div className="grid grid-cols-4 gap-4">
                {aiKpiCards.map((card) => (
                  <div key={card.title} className={"bg-gradient-to-br " + card.gradient + " text-white p-4 rounded-2xl shadow-card relative overflow-hidden"}>
                    {card.ai && (
                      <div className="absolute top-2 right-2 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={10} /> AI
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] text-white/80 truncate">{card.title}</p>
                      <div className="bg-white/20 p-1.5 rounded-lg">{card.icon}</div>
                    </div>
                    <h3 className="text-base font-bold">{typeof card.value === "number" ? (card.title.includes("Today") || card.title.includes("Tomorrow") || card.title.includes("Weekly") || card.title.includes("Monthly") || card.title.includes("Expected") ? formatCurrency(card.value) : card.value) : "-"}</h3>
                  </div>
                ))}
                {healthScore !== null ? (
                  <div className="bg-gradient-to-br from-pink-500 to-pink-400 text-white p-4 rounded-2xl shadow-card relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"><Sparkles size={10} /> AI</div>
                    <p className="text-[11px] text-white/80 mb-2">Inventory Health</p>
                    <div className="flex items-center justify-center">
                      <svg width="56" height="56" viewBox="0 0 36 36" className="transform -rotate-90">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="3" strokeOpacity="0.2" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeWidth="3" strokeDasharray={((gaugeValue / 100) * 94.25) + " 94.25"} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-lg font-bold">{gaugeValue}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-400 to-gray-300 text-white p-4 rounded-2xl shadow-card relative overflow-hidden">
                    <p className="text-[11px] text-white/80 mb-2">Inventory Health</p>
                    <div className="flex items-center justify-center h-14">
                      <span className="text-sm text-white/70">AI Unavailable</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-card">
              <h3 className="font-semibold text-gray-800 mb-4">Daily Sales vs Purchase</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                  <Area type="monotone" dataKey="sales" stroke="#6366F1" strokeWidth={2} fill="url(#salesGrad)" name="Sales" />
                  <Area type="monotone" dataKey="purchase" stroke="#F59E0B" strokeWidth={2} fill="url(#purchaseGrad)" name="Purchase" />
                </AreaChart>
              </ResponsiveContainer>
            </div>


          </>
        )}

        {activeTab === "forecasts" && (
          <>
            {aiDemand.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> Demand Forecast - Top 10 Products
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={aiDemand.map(d => ({ ...d, name: d.productName.length > 15 ? d.productName.slice(0, 15) + "..." : d.productName }))} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={100} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(v) => [v + " units", "Predicted Daily Demand"]} />
                    <Bar dataKey="predicted_daily_demand" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {aiStockout.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> Stock-Out Risk
                </h3>
                <ResponsiveContainer width="100%" height={Math.max(200, aiStockout.slice(0, 10).length * 35)}>
                  <BarChart data={aiStockout.slice(0, 10).map(d => ({ ...d, name: d.productName.length > 18 ? d.productName.slice(0, 18) + "..." : d.productName }))} layout="vertical" margin={{ left: 140 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={130} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(v) => [v + " days", "Until Stockout"]} />
                    <Bar dataKey="daysUntilStockout" radius={[0, 6, 6, 0]}>
                      {aiStockout.slice(0, 10).map((_, i) => (
                        <Cell key={i} fill={stockoutColor(aiStockout[i]?.daysUntilStockout || 0)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {activeTab === "insights" && (
          <>
            <div className="grid grid-cols-2 gap-6">
              {aiMovement && (
                <div className="bg-white p-6 rounded-2xl shadow-card">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-violet-500" /> Fast vs Slow Moving
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={[
                        { name: "Fast Moving", value: aiMovement.fast || 0 },
                        { name: "Medium", value: aiMovement.medium || 0 },
                        { name: "Slow Moving", value: aiMovement.slow || 0 },
                      ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}>
                        <Cell fill="#10B981" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 text-sm mt-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Fast ({aiMovement.fast})</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div>Medium ({aiMovement.medium})</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div>Slow ({aiMovement.slow})</div>
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-2xl shadow-card">
                <h3 className="font-semibold text-gray-800 mb-4">Top Products</h3>
                <div className="space-y-2">
                  {topProducts.slice(0, 5).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition">
                      <div className="flex items-center gap-3">
                        <span className={"w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white " + (
                          i === 0 ? "bg-amber-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-amber-600" : "bg-gray-300"
                        )}>{i + 1}</span>
                        <span className="text-sm font-medium text-gray-700">{p.productName}</span>
                      </div>
                      <span className="text-sm font-bold text-indigo-600">{p.totalQuantity} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {aiRestock.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> Restock Recommendations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Product</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Current</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Avg Daily</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Pred 30d</th>
                        <th className="text-right py-3 px-2 text-gray-500 font-medium">Safety</th>
                        <th className="text-right py-3 px-2 text-indigo-600 font-medium">Recommend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiRestock.filter(r => r.recommendedQty > 0).slice(0, 8).map((r, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-2 font-medium text-gray-700">{r.productName}</td>
                          <td className="py-3 px-2 text-right text-gray-600">{r.currentStock}</td>
                          <td className="py-3 px-2 text-right text-gray-600">{r.avgDailySales}</td>
                          <td className="py-3 px-2 text-right text-gray-600">{r.predictedDemand30d}</td>
                          <td className="py-3 px-2 text-right text-gray-600">{r.safetyStock}</td>
                          <td className="py-3 px-2 text-right font-bold text-indigo-600">+{r.recommendedQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {aiSuppliers.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-card">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" /> Supplier Recommendations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-gray-500 font-medium">Supplier</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">AI Score</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">Price</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">Delivery</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">Rating</th>
                        <th className="text-center py-3 px-2 text-gray-500 font-medium">Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiSuppliers.slice(0, 6).map((s, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-2 font-medium text-gray-700">{s.supplierName}</td>
                          <td className="py-3 px-2 text-center"><span className={"px-2 py-0.5 rounded-full text-xs font-semibold " + (s.overallScore >= 70 ? "bg-emerald-100 text-emerald-700" : s.overallScore >= 40 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700")}>{s.overallScore}</span></td>
                          <td className="py-3 px-2 text-center text-gray-600">{s.priceScore}</td>
                          <td className="py-3 px-2 text-center text-gray-600">{s.deliveryScore}</td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={12} className={star <= s.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center text-gray-600">{s.productCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
