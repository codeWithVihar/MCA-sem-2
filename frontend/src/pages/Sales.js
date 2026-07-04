import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { FileText, ShoppingCart, Phone } from "lucide-react";
import LoadingBox from "../components/ui/LoadingBox";

const Sales = () => {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState("BILLING");

  // POS Billing State
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState("All Orders");

  const loadOrders = () => {
    setOrdersLoading(true);
    API.get("/orders")
      .then((res) => {
        const data = res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => { console.error(err); toast.error("Failed to load orders"); })
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data))
      .catch(() => toast.error("Failed to load products"));
    loadOrders();
  }, []);

  // --- POS BILLING LOGIC ---

  const selectedProduct = products.find((p) => p._id === productId);

  const addToCart = () => {
    if (!selectedProduct) return;

    if (quantity <= 0 || isNaN(quantity)) {
      return toast.warn("Enter a valid quantity");
    }
    const existingCartQty = cart.find((item) => item._id === selectedProduct._id)?.quantity || 0;
    if (quantity + existingCartQty > selectedProduct.currentStock) {
      return toast.warn(`Only ${selectedProduct.currentStock - existingCartQty} more units available`);
    }

    const existing = cart.find((item) => item._id === selectedProduct._id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === selectedProduct._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }

    setQuantity(1);
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const totalGST = cart.reduce(
    (sum, item) =>
      sum +
      ((item.sellingPrice * item.quantity) * item.gstPercent) / 100,
    0
  );

  const total = subTotal + totalGST;

  const handleSubmit = async () => {
    if (cart.length === 0) return toast.warn("Cart is empty");
    
    try {
      const res = await API.post("/sales", {
        items: cart.map((item) => ({
          productId: item._id,
          quantitySold: item.quantity,
        })),
      });

      navigate(`/invoice/${res.data.sale._id}`);
      toast.success("Sale completed");
    } catch (err) {
      toast.error("Sale failed");
    }
  };

  // --- ORDERS LOGIC ---

  const dispatchOrder = async (id) => {
    try {
      const res = await API.post(`/orders/${id}/dispatch`);
      toast.success(res.data.message || "Order dispatched");
      loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Dispatch failed");
    }
  };

  const completeOrder = async (id) => {
    try {
      await API.post(`/orders/${id}/complete`);
      toast.success("Order Completed");
      loadOrders();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const rejectOrder = async (id) => {
    try {
      await API.post(`/orders/${id}/reject`);
      toast.success("Order Rejected");
      loadOrders();
    } catch (err) {
      toast.error("Reject failed");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === "PENDING") return <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-[10px]">PENDING</span>;
    if (s === "DISPATCHED") return <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-[10px]">DISPATCHED</span>;
    if (s === "COMPLETED") return <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[10px]">COMPLETED</span>;
    return <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-full text-[10px]">{status}</span>;
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === "All Orders") return true;
    return o.status?.toUpperCase() === orderFilter.toUpperCase();
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        
        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("BILLING")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
              activeTab === "BILLING"
                ? "bg-secondary text-gray-800"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <FileText size={18} />
            Billing
          </button>
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${
              activeTab === "ORDERS"
                ? "bg-secondary text-gray-800"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            <ShoppingCart size={18} />
            Orders
          </button>
        </div>

        {/* --- BILLING VIEW --- */}
        {activeTab === "BILLING" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Multi-Item Billing</h2>

            {/* Add Item Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
              <div className="grid grid-cols-3 gap-4">
                <select
                  className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.productName} (Stock: {p.currentStock})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />

                <button
                  type="button"
                  onClick={addToCart}
                  className="bg-primary text-gray-800 font-semibold hover:brightness-95 rounded-lg shadow-sm transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Empty Cart State */}
            {cart.length === 0 && (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart size={28} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add products to start building a sale</p>
              </div>
            )}

            {/* Cart Table */}
            {cart.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <table className="w-full text-left mb-6">
                  <thead className="bg-primary/20 text-gray-800">
                    <tr>
                      <th className="p-3 rounded-l-lg font-semibold text-sm">Product</th>
                      <th className="p-3 font-semibold text-sm">Qty</th>
                      <th className="p-3 font-semibold text-sm">Price</th>
                      <th className="p-3 font-semibold text-sm">Total</th>
                      <th className="p-3 rounded-r-lg font-semibold text-sm">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id} className="border-b border-gray-50">
                        <td className="p-3 text-gray-700 text-sm">{item.productName}</td>
                        <td className="p-3 text-gray-700 text-sm">{item.quantity}</td>
                        <td className="p-3 text-gray-700 text-sm">₹{item.sellingPrice}</td>
                        <td className="p-3 text-gray-700 font-medium text-sm">
                          ₹{item.sellingPrice * item.quantity}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Billing Summary */}
                <div className="text-right space-y-2 border-t pt-4">
                  <div className="text-gray-500 text-sm">Subtotal: <span className="text-gray-800">₹{subTotal.toFixed(2)}</span></div>
                  <div className="text-gray-500 text-sm">GST: <span className="text-gray-800">₹{totalGST.toFixed(2)}</span></div>
                  <div className="font-bold text-xl text-gray-800 pt-2">
                    Grand Total: ₹{total.toFixed(2)}
                  </div>
                </div>

                <div className="text-right mt-6">
                  <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
                  >
                    Complete Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- ORDERS VIEW --- */}
        {activeTab === "ORDERS" && (
          <div className="animate-fade-in bg-white p-6 rounded-2xl shadow-card border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
              <select 
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option>All Orders</option>
                <option>Pending</option>
                <option>Dispatched</option>
                <option>Completed</option>
              </select>
            </div>

            {ordersLoading && orders.length === 0 ? (
              <LoadingBox text="Loading orders..." />
            ) : (
            <div className="overflow-y-auto max-h-[calc(100vh-280px)] relative">
              <table className="w-full text-left">
                <thead className="sticky top-0 z-10 bg-secondary text-gray-800">
                  <tr>
                    <th className="p-4 rounded-l-lg font-semibold text-sm">Order</th>
                    <th className="p-4 font-semibold text-sm">Customer</th>
                    <th className="p-4 font-semibold text-sm">Items</th>
                    <th className="p-4 font-semibold text-sm">Total</th>
                    <th className="p-4 font-semibold text-sm">Status</th>
                    <th className="p-4 rounded-r-lg font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      
                      {/* Order Info */}
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-800 text-sm mb-1">
                          #{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-800 text-sm mb-1">{order.customerName}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
                          <Phone size={12} className="text-rose-500" />
                          {order.customerPhone}
                        </div>
                        <div className="text-xs text-gray-400">{order.customerAddress}</div>
                      </td>

                      {/* Items */}
                      <td className="p-4 align-top text-sm text-gray-600">
                        {order.items.slice(0, 2).map((i, idx) => (
                          <div key={idx}>{i.product?.productName} x {i.quantity}</div>
                        ))}
                        {order.items.length > 2 && <span className="text-xs text-gray-400">+{order.items.length - 2} more</span>}
                      </td>

                      {/* Total */}
                      <td className="p-4 align-top font-bold text-indigo-600 text-sm">
                        ₹{order.totalAmount}
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top flex gap-2">
                        {order.status?.toUpperCase() === "PENDING" && (
                          <>
                            <button 
                              onClick={() => dispatchOrder(order._id)} 
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition shadow-sm"
                            >
                              Dispatch
                            </button>
                            <button 
                              onClick={() => rejectOrder(order._id)} 
                              className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded text-xs transition shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {order.status?.toUpperCase() === "DISPATCHED" && (
                          <button 
                            onClick={() => completeOrder(order._id)} 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs transition shadow-sm"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && !ordersLoading && (
                    <tr><td colSpan="6" className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <ShoppingCart size={28} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No online orders found</p>
                        <p className="text-xs text-gray-400 mt-1">Orders placed by customers will appear here</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
};

export default Sales;