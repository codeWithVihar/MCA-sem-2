import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { PackagePlus, PackageMinus, Box } from "lucide-react";

const StockManage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState("IN");

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(quantity);
    if (!productId || qty <= 0) {
      return toast.warn("Please select a product and enter a valid quantity.");
    }
    try {
      const url = type === "IN" ? "/stock/in" : "/stock/out";
      await API.post(url, {
        productId,
        quantity: qty,
        reason: type === "IN" ? "UI Stock In" : "UI Stock Out",
      });
      toast.success("Stock updated successfully");
      setProductId("");
      setQuantity(0);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Stock Management</h2>
          <p className="text-sm text-gray-400 mt-1">Manually adjust inventory levels</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Stock Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Operation Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setType("IN")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-medium border-2 ${
                    type === "IN"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <PackagePlus size={18} className={type === "IN" ? "text-emerald-500" : "text-gray-400"} />
                  Stock IN
                </button>
                <button
                  type="button"
                  onClick={() => setType("OUT")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-medium border-2 ${
                    type === "OUT"
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <PackageMinus size={18} className={type === "OUT" ? "text-rose-500" : "text-gray-400"} />
                  Stock OUT
                </button>
              </div>
            </div>

            {/* Product Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Product
              </label>
              <div className="relative">
                <Box size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition bg-white"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                placeholder="Enter quantity"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2 mt-4"
            >
              Confirm Update
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StockManage;
