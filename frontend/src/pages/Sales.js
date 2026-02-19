import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Sales = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.data))
      .catch(() => alert("Failed to load products"));
  }, []);

  const selectedProduct = products.find((p) => p._id === productId);

  const addToCart = () => {
    if (!selectedProduct) return;

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
    try {
      const res = await API.post("/sales", {
        items: cart.map((item) => ({
          productId: item._id,
          quantitySold: item.quantity,
        })),
      });

      navigate(`/invoice/${res.data.sale._id}`);
    } catch (err) {
      alert("Sale failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Multi-Item Billing</h2>

      {/* Add Item Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">

        <div className="grid grid-cols-3 gap-4">
          <select
            className="p-3 rounded-lg border"
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
            className="p-3 rounded-lg border"
          />

          <button
            type="button"
            onClick={addToCart}
            className="bg-primary hover:bg-secondary rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Cart Table */}
      {cart.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">

          <table className="w-full text-left mb-6">
            <thead className="bg-primary">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-3">{item.productName}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">₹{item.sellingPrice}</td>
                  <td className="p-3">
                    ₹{item.sellingPrice * item.quantity}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Billing Summary */}
          <div className="text-right space-y-2">
            <div>Subtotal: ₹{subTotal}</div>
            <div>GST: ₹{totalGST}</div>
            <div className="font-bold text-xl">
              Grand Total: ₹{total}
            </div>
          </div>

          <div className="text-right mt-6">
            <button
              onClick={handleSubmit}
              className="bg-secondary px-6 py-2 rounded-lg"
            >
              Complete Sale
            </button>
          </div>

        </div>
      )}
    </Layout>
  );
};

export default Sales;
