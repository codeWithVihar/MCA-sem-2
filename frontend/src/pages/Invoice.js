import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Layout from "../components/Layout";

const Invoice = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    API.get(`/sales/${id}`)
      .then((res) => setSale(res.data))
      .catch(() => alert("Failed to load invoice"));
  }, [id]);

  if (!sale) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-md">

        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">
              Smart Inventory System
            </h2>
            <p>Hardware Store</p>
            <p>GSTIN: 22AAAAA0000A1Z5</p>
          </div>

          <div className="text-right">
            <h3 className="text-xl font-semibold">INVOICE</h3>
            <p>Invoice No: {sale.invoiceNumber}</p>
            <p>
              Date: {new Date(sale.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8 border-collapse">
          <thead className="bg-primary">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">GST</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">
                  {item.product?.productName}
                </td>
                <td className="p-3">{item.quantitySold}</td>
                <td className="p-3">₹{item.sellingPrice}</td>
                <td className="p-3">₹{item.subTotal}</td>
                <td className="p-3">₹{item.gstAmount}</td>
                <td className="p-3 font-medium">
                  ₹{item.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-1/3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{sale.totalSubAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Total GST:</span>
              <span>₹{sale.totalGSTAmount}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Grand Total:</span>
              <span>₹{sale.grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Print */}
        <div className="text-right mt-6">
          <button
            onClick={() => window.print()}
            className="bg-secondary px-6 py-2 rounded-lg hover:bg-primary transition"
          >
            Print Invoice
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default Invoice;
