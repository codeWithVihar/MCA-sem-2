import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { CreditCard } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cart = state?.cart || [];

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: ""
  });

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const subTotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const gst = cart.reduce((sum, item) => {
    const gstPct = item.gstPercent || 18;
    return sum + (item.sellingPrice * item.quantity * gstPct) / 100;
  }, 0);
  const total = subTotal + gst;

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.email || !form.address) {
      toast.warn("Please fill all details");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/orders", {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        customerAddress: form.address,
        items: cart.map((item) => ({ productId: item._id, quantity: item.quantity }))
      });
      toast.success("Order placed successfully ✅");
      navigate("/order-success", { state: { order: res.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition";

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-5xl animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">1</span>
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input type="text" name="phone" value={form.phone} className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input type="email" name="email" value={form.email} className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Address</label>
                <textarea name="address" value={form.address} rows="4" className={`${inputClass} resize-none`} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-8 rounded-3xl shadow-card border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs">2</span>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.images ? (
                        <img src={`http://localhost:5000/uploads/${item.images}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{item.productName}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold text-indigo-600">
                    ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-3 bg-gray-50 p-6 rounded-2xl">
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-800 border-t border-gray-200 pt-3 mt-1">
                <span>Total</span>
                <span className="text-indigo-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CreditCard size={18} /> {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
