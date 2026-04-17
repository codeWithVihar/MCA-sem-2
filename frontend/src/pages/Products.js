import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  /* ================= LOAD ================= */

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      })
      .catch(() => alert("Failed to load products"));
  }, []);

  /* ================= FILTER ================= */

  useEffect(() => {

    let filtered = products;

    if (search) {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);

  }, [search, category, products]);

  const categories = [...new Set(products.map((p) => p.category))];

  /* ================= BADGE ================= */

  const getStockBadge = (status) => {

    if (status === "LOW_STOCK")
      return "bg-yellow-100 text-yellow-700";

    if (status === "OUT_OF_STOCK")
      return "bg-red-100 text-red-700";

    return "bg-green-100 text-green-700";
  };

  /* ================= VIEW ================= */

  const openProductDetails = async (product) => {

    setSelectedProduct(product);

    try {
      const res = await API.get(`/stock/history/${product._id}`);
      setHistory(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (error) {
      console.log(error);
    }

  };

  /* ================= DATE FORMAT ================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); // 🔥 date + time
  };

  return (
    <Layout>

      <h2 className="text-2xl font-semibold mb-6">
        Product Management
      </h2>

      {/* FILTERS */}

      <div className="flex gap-4 mb-6">

        <input
          type="text"
          placeholder="Search product..."
          className="p-3 border rounded-lg w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}

        </select>

        <button
          onClick={() => navigate("/add-product")}
          className="bg-primary px-5 py-3 rounded-lg ml-auto"
        >
          + Create Product
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-primary">

            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Created</th> {/* 🔥 NEW */}
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((p) => (

              <tr key={p._id} className="border-b hover:bg-soft">

                <td className="p-4 font-medium">
                  {p.productName}
                </td>

                <td className="p-4">{p.brand}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{p.currentStock}</td>
                <td className="p-4">₹{p.sellingPrice}</td>

                {/* 🔥 CREATED DATE */}
                <td className="p-4 text-sm text-gray-500">
                  {formatDate(p.createdAt)}
                </td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStockBadge(p.stockStatus)}`}>
                    {p.stockStatus}
                  </span>
                </td>

                <td className="p-4 space-x-3">

                  <button
                    onClick={() => openProductDetails(p)}
                    className="text-green-600 font-medium"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit-product/${p._id}`)}
                    className="text-blue-600 font-medium"
                  >
                    Edit
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}

      {selectedProduct && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[650px] shadow-lg">

            <h3 className="text-xl font-semibold mb-4">
              Product Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <p><b>Name:</b> {selectedProduct.productName}</p>
              <p><b>Brand:</b> {selectedProduct.brand}</p>

              <p><b>Category:</b> {selectedProduct.category}</p>
              <p><b>SKU:</b> {selectedProduct.sku}</p>

              <p><b>Unit:</b> {selectedProduct.unit}</p>
              <p><b>Stock:</b> {selectedProduct.currentStock}</p>

              <p><b>Purchase Price:</b> ₹{selectedProduct.purchasePrice}</p>
              <p><b>Selling Price:</b> ₹{selectedProduct.sellingPrice}</p>

              <p><b>GST:</b> {selectedProduct.gstPercent}%</p>
              <p><b>Discount:</b> {selectedProduct.discountPercent}%</p>

              <p><b>Min Stock:</b> {selectedProduct.minStockLevel}</p>
              <p><b>Status:</b> {selectedProduct.status}</p>

              <p><b>Created:</b> {formatDate(selectedProduct.createdAt)}</p> {/* 🔥 NEW */}

              <p><b>Returnable:</b> {selectedProduct.returnable ? "Yes" : "No"}</p>
              <p><b>Damage Prone:</b> {selectedProduct.damageProne ? "Yes" : "No"}</p>

              <p><b>Hazardous:</b> {selectedProduct.hazardous ? "Yes" : "No"}</p>
              <p><b>Stock Status:</b> {selectedProduct.stockStatus}</p>

            </div>

            {/* STOCK HISTORY */}

            <h3 className="text-lg font-semibold mt-6 mb-3">
              Stock History
            </h3>

            <div className="max-h-48 overflow-y-auto border rounded">

              <table className="w-full text-sm">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Reason</th>
                  </tr>
                </thead>

                <tbody>

                  {Array.isArray(history) &&
                    history.map((h) => (
                      <tr key={h._id}>
                        <td className="p-2">
                          {formatDate(h.createdAt)}
                        </td>
                        <td className="p-2">{h.type}</td>
                        <td className="p-2">{h.quantity}</td>
                        <td className="p-2">{h.reason}</td>
                      </tr>
                    ))
                  }

                </tbody>

              </table>

            </div>

            <div className="mt-6 text-right">

              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-primary px-4 py-2 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </Layout>
  );
};

export default Products;