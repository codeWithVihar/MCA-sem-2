import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import { formatDate } from "../utils/formatters";
import { Plus, Search, Eye, Pencil, Package } from "lucide-react";
import LoadingBox from "../components/ui/LoadingBox";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(20);
  const PAGE_SIZE = 20;

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load products");
        setLoading(false);
      });
  }, []);

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
    setVisibleCount(20);
  }, [search, category, products]);

  const categories = [...new Set(products.map((p) => p.category))];

  const openProductDetails = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await API.get(`/stock/history/${product._id}`);
      setHistory(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Layout><LoadingBox text="Loading products..." /></Layout>;

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-400 mt-1">{products.length} total products</p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-sidebar-light transition text-sm font-medium"
          >
            <Plus size={16} />
            Create Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card overflow-x-auto overflow-y-auto max-h-[calc(100vh-240px)] relative border border-gray-100">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-indigo-600 text-white shadow-sm">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Product</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Brand</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Price</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/80 transition">
                  <td className="px-5 py-4 font-medium text-gray-800">{p.productName}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{p.brand}</td>
                  <td className="px-5 py-4 text-gray-500 text-sm">{p.category}</td>
                  <td className="px-5 py-4 font-semibold text-gray-700">{p.currentStock}</td>
                  <td className="px-5 py-4 text-gray-700">₹{p.sellingPrice}</td>
                  <td className="px-5 py-4 text-gray-400 text-sm">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-4"><Badge status={p.stockStatus} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProductDetails(p)}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/edit-product/${p._id}`)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <tbody><tr><td colSpan="8" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Package size={28} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">{search || category ? "No products match your filters" : "No products found"}</p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">{search || category ? "Try different search terms" : "Create your first product to get started"}</p>
                    {!search && !category && (
                      <button onClick={() => navigate("/add-product")} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                        Add Product
                      </button>
                    )}
                  </div>
                </td></tr></tbody>
              )}
            </tbody>
          </table>
          {filteredProducts.length > visibleCount && (
            <div className="text-center py-4 border-t border-gray-100">
              <button
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
              >
                Show More ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
        width="max-w-[650px]"
      >
        {selectedProduct && (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <p><span className="text-gray-400">Name:</span> <span className="font-medium">{selectedProduct.productName}</span></p>
              <p><span className="text-gray-400">Brand:</span> <span className="font-medium">{selectedProduct.brand}</span></p>
              <p><span className="text-gray-400">Category:</span> <span className="font-medium">{selectedProduct.category}</span></p>
              <p><span className="text-gray-400">SKU:</span> <span className="font-medium">{selectedProduct.sku}</span></p>
              <p><span className="text-gray-400">Unit:</span> <span className="font-medium">{selectedProduct.unit}</span></p>
              <p><span className="text-gray-400">Stock:</span> <span className="font-medium">{selectedProduct.currentStock}</span></p>
              <p><span className="text-gray-400">Purchase:</span> <span className="font-medium">₹{selectedProduct.purchasePrice}</span></p>
              <p><span className="text-gray-400">Selling:</span> <span className="font-medium">₹{selectedProduct.sellingPrice}</span></p>
              <p><span className="text-gray-400">GST:</span> <span className="font-medium">{selectedProduct.gstPercent}%</span></p>
              <p><span className="text-gray-400">Discount:</span> <span className="font-medium">{selectedProduct.discountPercent}%</span></p>
              <p><span className="text-gray-400">Min Stock:</span> <span className="font-medium">{selectedProduct.minStockLevel}</span></p>
              <p><span className="text-gray-400">Status:</span> <Badge status={selectedProduct.stockStatus} /></p>
              <p><span className="text-gray-400">Created:</span> <span className="font-medium">{formatDate(selectedProduct.createdAt)}</span></p>
              <p><span className="text-gray-400">Returnable:</span> <span className="font-medium">{selectedProduct.returnable ? "Yes" : "No"}</span></p>
            </div>

            {/* Stock History */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Stock History</h4>
              <div className="max-h-48 overflow-y-auto border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Date</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Type</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Qty</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-500">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.isArray(history) &&
                      history.map((h) => (
                        <tr key={h._id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-500">{formatDate(h.createdAt)}</td>
                          <td className="px-3 py-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              h.type === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                            }`}>
                              {h.type}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-medium">{h.quantity}</td>
                          <td className="px-3 py-2 text-gray-500">{h.reason}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default Products;