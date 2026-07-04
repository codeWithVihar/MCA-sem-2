import React, { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { Search, CornerDownLeft } from "lucide-react";

const SalesReturn = () => {
  const [invoiceId, setInvoiceId] = useState("");
  const [sale, setSale] = useState(null);
  const [returns, setReturns] = useState({});
  const [reason, setReason] = useState("");

  const fetchSale = async () => {
    if(!invoiceId) return toast.warn("Enter invoice number");
    try {
      const res = await API.get(`/sales/${invoiceId}`);
      setSale(res.data);
    } catch (error) {
      toast.error("Invoice not found");
    }
  };

  const handleQtyChange = (productId, qty) => {
    setReturns({ ...returns, [productId]: qty });
  };

  const handleReturn = async () => {
    try {
      const items = Object.keys(returns)
        .map((id) => ({ productId: id, quantity: Number(returns[id]) }))
        .filter(item => item.quantity > 0);
        
      if(items.length === 0) return toast.warn("Select items to return");

      await API.post("/sales-return", {
        saleId: invoiceId,
        items,
        reason
      });
      toast.success("Return processed successfully");
      setSale(null);
      setReturns({});
      setReason("");
      setInvoiceId("");
    } catch (error) {
      toast.error("Return failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Return</h2>
          <p className="text-sm text-gray-400 mt-1">Process returns and update stock automatically</p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Number</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition bg-gray-50 focus:bg-white"
                  placeholder="e.g. INV-123456"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                />
              </div>
            </div>
            <button onClick={fetchSale} className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition text-sm font-medium h-[46px]">
              Load Invoice
            </button>
          </div>
        </div>

        {/* Sale Details */}
        {sale && (
          <div className="bg-white p-6 rounded-2xl shadow-card animate-fade-in">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                  <CornerDownLeft size={20} className="text-primary" />
                  Return Items
                </h3>
                <p className="text-sm text-gray-500 mt-1">Invoice: {sale.invoiceNumber}</p>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 rounded-t-xl">
                  <tr>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider">Product</th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-center">Sold Qty</th>
                    <th className="p-3 text-xs font-semibold uppercase tracking-wider text-center">Return Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sale.items.map((item) => {
                    if (!item.product) return null;
                    return (
                      <tr key={item.product._id} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-700 text-sm">{item.product?.productName}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">{item.quantitySold}</span>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max={item.quantitySold}
                            className="w-24 p-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => handleQtyChange(item.product._id, Number(e.target.value))}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reason for return</label>
                <textarea
                  placeholder="E.g., Damaged item, Customer changed mind..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24 bg-gray-50 focus:bg-white transition"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button onClick={handleReturn} className="w-full bg-rose-500 text-white py-3.5 rounded-xl hover:bg-rose-600 transition font-semibold">
                Process Return
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalesReturn;