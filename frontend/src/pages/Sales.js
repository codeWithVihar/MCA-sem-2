import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Sales = () => {

  const navigate = useNavigate();

  const [mode, setMode] = useState("billing");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  /* ================= LOAD ORDERS ================= */

  const loadOrders = () => {
    API.get("/orders") // ✅ ALL ORDERS (FIXED)
      .then(res => {
        const data = res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => alert("Failed to load orders"));
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {

    API.get("/products")
      .then(res => setProducts(res.data.data || []))
      .catch(() => alert("Failed to load products"));

    loadOrders();

    const interval = setInterval(loadOrders, 5000);

    return () => clearInterval(interval);

  }, []);

  const selectedProduct = products.find(p => p._id === productId);

  /* ================= CART ================= */

  const addToCart = () => {

    if (!selectedProduct) return alert("Select product");

    if (quantity > selectedProduct.currentStock) {
      return alert(`Only ${selectedProduct.currentStock} available`);
    }

    const exist = cart.find(i => i._id === selectedProduct._id);

    if (exist) {

      const newQty = exist.quantity + quantity;

      if (newQty > selectedProduct.currentStock) {
        return alert(`Only ${selectedProduct.currentStock} available`);
      }

      setCart(cart.map(i =>
        i._id === selectedProduct._id
          ? { ...i, quantity: newQty }
          : i
      ));

    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }

    setQuantity(1);
  };

  const removeItem = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  /* ================= CALCULATIONS ================= */

  const subTotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const totalGST = cart.reduce(
    (sum, item) =>
      sum +
      ((item.sellingPrice * item.quantity) * (item.gstPercent || 0)) / 100,
    0
  );

  const total = subTotal + totalGST;

  /* ================= CREATE SALE ================= */

  const handleSubmit = async () => {
    try {

      const res = await API.post("/sales", {
        items: cart.map(item => ({
          productId: item._id,
          quantitySold: item.quantity
        }))
      });

      setCart([]);

      navigate(`/invoice/${res.data.sale._id}`);

    } catch (error) {
      alert("Sale failed");
    }
  };

  /* ================= ORDER ACTIONS ================= */

  const dispatchOrder = async (id) => {
  try {
    const res = await API.post(`/orders/${id}/dispatch`);

    alert(
      res.data.message ||
      "Order dispatched successfully and invoice sent to customer email 🚚📧"
    );

    loadOrders();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Dispatch failed"
    );
  }
};

  const completeOrder = async (id) => {
    try {

      await API.post(`/orders/${id}/complete`);

      alert("Order Completed ✅");

      loadOrders();

    } catch {
      alert("Failed");
    }
  };

  const rejectOrder = async (id) => {
    try {

      await API.post(`/orders/${id}/reject`);

      loadOrders();

    } catch {
      alert("Reject failed");
    }
  };

  /* ================= UI ================= */

  return (
    <Layout>

      {/* SWITCH */}
      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setMode("billing")}
          className={`px-5 py-2 rounded-lg ${
            mode === "billing"
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          🧾 Billing
        </button>


        <button
          onClick={() => setMode("orders")}
          className={`px-5 py-2 rounded-lg ${
            mode === "orders"
              ? "bg-primary text-white"
              : "bg-gray-200"
          }`}
        >
          🛒 Orders
        </button>

      </div>

      {mode === "billing" && (
  <div className="grid grid-cols-12 gap-6">

    {/* LEFT SIDE */}
    <div className="col-span-4 bg-white rounded-2xl shadow p-6">

      <h2 className="text-xl font-semibold mb-5">
        Create Bill
      </h2>

      {/* SEARCH PRODUCT */}
      <div className="mb-4 relative">
        <label className="block text-sm text-gray-600 mb-2">
          Search Product
        </label>

        <input
          type="text"
          placeholder="Type product name..."
          value={searchProduct}
          onChange={(e) => {
            setSearchProduct(e.target.value);
            setProductId("");
          }}
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* DROPDOWN */}
        {searchProduct && (
          <div className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">

            {products
              .filter((product) =>
                product.productName
                  .toLowerCase()
                  .includes(searchProduct.toLowerCase())
              )
              .slice(0, 8)
              .map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    setProductId(product._id);
                    setSearchProduct(product.productName);
                  }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <div className="font-medium">
                    {product.productName}
                  </div>

                  <div className="text-xs text-gray-500">
                    ₹{product.sellingPrice} • Stock: {product.currentStock}
                  </div>
                </div>
              ))}

            {products.filter((product) =>
              product.productName
                .toLowerCase()
                .includes(searchProduct.toLowerCase())
            ).length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-400">
                No products found
              </div>
            )}

          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      {selectedProduct && (
        <div className="bg-gray-50 rounded-xl p-4 border mb-5">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Price</span>
            <span className="font-medium">
              ₹{selectedProduct.sellingPrice}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Stock</span>
            <span className="font-medium">
              {selectedProduct.currentStock}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">GST</span>
            <span className="font-medium">
              {selectedProduct.gstPercent || 0}%
            </span>
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div className="mb-5">
        <label className="block text-sm text-gray-600 mb-2">
          Quantity
        </label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={addToCart}
        disabled={!selectedProduct}
        className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition disabled:opacity-00"
      >
        Add Product
      </button>

    </div>

    {/* RIGHT SIDE */}
    <div className="col-span-8 bg-white rounded-2xl shadow overflow-hidden">

      <div className="flex justify-between items-center p-5 border-b">
        <h2 className="text-xl font-semibold">
          Billing Cart
        </h2>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-primary">
            ₹{total.toFixed(2)}
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          No items added
        </div>
      ) : (
        <>
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-center px-3 py-3">Qty</th>
                <th className="text-center px-3 py-3">Price</th>
                <th className="text-center px-3 py-3">GST</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-center px-3 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => {
                const gst =
                  ((item.sellingPrice * item.quantity) *
                    (item.gstPercent || 0)) /
                  100;

                const itemTotal =
                  item.sellingPrice * item.quantity + gst;

                return (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      {item.productName}
                    </td>

                    <td className="text-center">
                      {item.quantity}
                    </td>

                    <td className="text-center">
                      ₹{item.sellingPrice}
                    </td>

                    <td className="text-center">
                      ₹{gst.toFixed(2)}
                    </td>

                    <td className="text-right px-5 font-medium">
                      ₹{itemTotal.toFixed(2)}
                    </td>

                    <td className="text-center">
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end p-5 border-t bg-gray-50">
            <div className="w-72">

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>GST</span>
                <span>₹{totalGST.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3 mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={cart.length === 0}
                className="w-full bg-purple-300 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
              >
                Generate Invoice
              </button>

            </div>
          </div>
        </>
      )}

    </div>

  </div>
)}
      {/* ================= ORDERS ================= */}

      {mode === "orders" && (

  <div>

    {/* HEADER + FILTER */}
    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-semibold">
        Order Management
      </h2>

      <select
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="ALL">All Orders</option>
        <option value="PENDING">Pending</option>
        <option value="DISPATCHED">Dispatched</option>
        <option value="COMPLETED">Completed</option>
        <option value="REJECTED">Rejected</option>
      </select>

    </div>

    {/* EMPTY */}
    {orders.length === 0 ? (
      <div className="bg-white p-10 rounded-xl shadow text-center text-gray-400">
        No orders found 🚫
      </div>
    ) : (

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          {/* HEAD */}
          <thead className="bg-primary text-white">

            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {[...orders]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .filter(o => filter === "ALL" || o.status === filter)
              .map(order => {

                const statusStyles = {
                  PENDING: "bg-yellow-100 text-yellow-700",
                  DISPATCHED: "bg-blue-100 text-blue-700",
                  COMPLETED: "bg-green-100 text-green-700",
                  REJECTED: "bg-red-100 text-red-700"
                };

                return (
                  <tr key={order._id} className="border-b hover:bg-gray-50">

                    {/* ORDER */}
                    <td className="p-4">
                      <p className="font-medium">
                        #{order._id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-4">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        📞 {order.customerPhone}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.customerAddress || "N/A"}
                      </p>
                    </td>

                    {/* ITEMS */}
                    <td className="p-4 text-sm">
                      {order.items.slice(0, 2).map((i, idx) => (
                        <div key={idx}>
                          {i.product?.productName} x {i.quantity}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{order.items.length - 2} more
                        </span>
                      )}
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-bold text-indigo-600">
                      ₹{order.totalAmount}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${statusStyles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 space-x-2">

                      {order.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => dispatchOrder(order._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Dispatch
                          </button>

                          <button
                            onClick={() => rejectOrder(order._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {order.status === "DISPATCHED" && (
                        <button
                          onClick={() => completeOrder(order._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Complete
                        </button>
                      )}

                      {/* {order.status === "COMPLETED" && (
                        <button
                          onClick={() => navigate(`/invoice/${order.sale}`)}
                          className="bg-indigo-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Invoice
                        </button>
                      )} */}

                    </td>

                  </tr>
                );
              })}

          </tbody>

        </table>

      </div>

    )}

  </div>
)}

    </Layout>
  );
};

export default Sales;