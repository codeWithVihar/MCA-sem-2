import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cart = state?.cart || [];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  /* ================= AUTO LOAD CUSTOMER ================= */

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));

    if (!customer) {
      toast.error("Please login first");
      navigate("/customer-login");
      return;
    }

    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || ""
    });
  }, [navigate]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= CALCULATE ================= */

  const subTotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const gst = subTotal * 0.18;
  const total = subTotal + gst;

  /* ================= PLACE ORDER ================= */

  const placeOrder = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.address
    ) {
      toast.error("Please fill all details");
      return;
    }

    try {
      const res = await API.post("/orders", {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerAddress: form.address,

        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        }))
      });

      toast.success("Order placed successfully ✅");

      navigate("/order-success", {
        state: {
          order: res.data
        }
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Order failed"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF] p-10">

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-10">

        {/* CUSTOMER DETAILS */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6">
            Customer Details
          </h2>

          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={handleChange}
          />

          <textarea
            name="address"
            value={form.address}
            placeholder="Delivery Address"
            rows="5"
            className="w-full p-3 border rounded-lg"
            onChange={handleChange}
          />

        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {item.productName}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="font-medium">
                  ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

          </div>

          <hr className="mb-4" />

          <div className="space-y-3">

            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{subTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-primary">
                ₹{total.toFixed(2)}
              </span>
            </div>

          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-semibold"
          >
            Place Order
          </button>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
