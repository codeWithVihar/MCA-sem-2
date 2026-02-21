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
  ResponsiveContainer
} from "recharts";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Analytics = () => {
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [movement, setMovement] = useState(null);
  const [reorder, setReorder] = useState([]);
  const [filter, setFilter] = useState("30");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    API.get(`/sales/monthly?range=${filter}`).then(res =>
      setMonthly(res.data)
    );

    API.get("/sales/top-products").then(res =>
      setTopProducts(res.data)
    );

    API.get("/sales/movement").then(res =>
      setMovement(res.data)
    );

    API.get("/products/reorder").then(res =>
      setReorder(res.data)
    );
  }, [filter]);

  if (!movement) {
    return (
      <Layout>
        <p className="text-center mt-20 text-lg">Loading Analytics...</p>
      </Layout>
    );
  }

  /* ================= CALCULATIONS ================= */

  const totalRevenue = monthly.reduce(
    (sum, item) => sum + (item.totalRevenue || 0),
    0
  );

  const movementData = [
    { name: "Fast Moving", value: movement.fastMoving },
    { name: "Slow Moving", value: movement.slowMoving }
  ];

  const COLORS = ["#10B981", "#EF4444"];

  /* ================= EXCEL REPORT ================= */

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const sheetData = [
      ["SMART INVENTORY SYSTEM"],
      ["Business Analytics Report"],
      [`Date Range: Last ${filter} Days`],
      [`Generated On: ${new Date().toLocaleString()}`],
      [],
      ["SUMMARY"],
      ["Total Revenue", `₹ ${totalRevenue}`],
      ["Total Sales Entries", monthly.length],
      ["Fast Moving Products", movement.fastMoving],
      ["Slow Moving Products", movement.slowMoving],
      [],
      ["TOP SELLING PRODUCTS"],
      ["Product Name", "Total Quantity"],
      ...topProducts.map(p => [p.productName, p.totalQuantity]),
      [],
      ["REVENUE DETAILS"],
      ["Period", "Revenue"],
      ...monthly.map(item => [item._id, `₹ ${item.totalRevenue}`]),
      [],
      ["REORDER SUGGESTIONS"],
      ["Product", "Current Stock", "Suggested Order"],
      ...reorder.map(item => [
        item.productName,
        item.currentStock,
        item.suggestedOrder
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Report");

    XLSX.writeFile(workbook, "Smart_Inventory_Report.xlsx");
  };

  /* ================= PDF REPORT ================= */

  const exportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("SMART INVENTORY SYSTEM", 14, 15);

    doc.setFontSize(14);
    doc.text("Business Analytics Report", 14, 25);

    doc.setFontSize(10);
    doc.text(`Date Range: Last ${filter} Days`, 14, 32);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 38);

    doc.line(14, 42, 195, 42);

    // Summary
    doc.setFontSize(12);
    doc.text("SUMMARY", 14, 52);

    doc.setFontSize(11);
    doc.text(`Total Revenue: ₹ ${totalRevenue}`, 14, 60);
    doc.text(`Total Sales Entries: ${monthly.length}`, 14, 66);
    doc.text(`Fast Moving Products: ${movement.fastMoving}`, 14, 72);
    doc.text(`Slow Moving Products: ${movement.slowMoving}`, 14, 78);

    // Revenue Table
    autoTable(doc, {
      startY: 90,
      head: [["Period", "Revenue"]],
      body: monthly.map(item => [
        item._id,
        `₹ ${item.totalRevenue}`
      ]),
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Top Products Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Top Selling Products", "Quantity"]],
      body: topProducts.map(p => [
        p.productName,
        p.totalQuantity
      ]),
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save("Smart_Inventory_Report.pdf");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Business Analytics</h2>
          <p className="text-gray-500">
            Performance insights of your inventory system
          </p>
        </div>

        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">This Year</option>
          </select>

          <button
            onClick={exportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Export Excel
          </button>

          {/* <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Export PDF
          </button> */}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 font-semibold">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#6366F1"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 font-semibold">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalQuantity"
                fill="#8B5CF6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 font-semibold">Product Movement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={movementData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {movementData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 font-semibold">Reorder Suggestions</h3>
          <table className="w-full">
            <thead className="bg-indigo-100">
              <tr>
                <th className="p-2">Product</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Suggested</th>
              </tr>
            </thead>
            <tbody>
              {reorder.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.productName}</td>
                  <td className="p-2">{item.currentStock}</td>
                  <td className="p-2 font-semibold text-indigo-600">
                    {item.suggestedOrder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
};

export default Analytics;