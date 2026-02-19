import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const StockManage = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [type, setType] = useState("IN");

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("Failed to load products"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = type === "IN" ? "/stock/in" : "/stock/out";
      await API.post(url, {
        productId,
        quantity: Number(quantity),
        reason: type === "IN" ? "UI Stock In" : "UI Stock Out",
      });
      alert("Stock updated successfully");
    } catch (err) {
      alert("Operation failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Stock Management</h2>

      <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Select */}
          <div>
            <label className="block mb-2 font-medium">
              Select Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
            >
              <option value="">-- Choose Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.productName}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-2 font-medium">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* Stock Type Toggle */}
          <div>
            <label className="block mb-3 font-medium">
              Stock Operation
            </label>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setType("IN")}
                className={`flex-1 py-2 rounded-lg transition ${
                  type === "IN"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Stock IN
              </button>

              <button
                type="button"
                onClick={() => setType("OUT")}
                className={`flex-1 py-2 rounded-lg transition ${
                  type === "OUT"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Stock OUT
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary py-3 rounded-lg transition font-medium"
          >
            Update Stock
          </button>

        </form>
      </div>
    </Layout>
  );
};

export default StockManage;
