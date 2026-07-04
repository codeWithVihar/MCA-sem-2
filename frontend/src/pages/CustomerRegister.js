import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Key, ArrowLeft } from "lucide-react";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.warn("Please fill required fields");
    }
    if (form.password.length < 6) {
      return toast.warn("Password must be at least 6 characters");
    }
    try {
      setLoading(true);
      await API.post("/customers/register", form);
      toast.success("Registration successful");
      navigate("/customer-login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition bg-gray-50 focus:bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-10">
      <div className="absolute w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[80px] -bottom-20 -right-20 animate-pulse-soft"></div>
      
      <div className="w-full max-w-md relative z-10 px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft size={16} /> Back to home
        </button>

        <div className="bg-white p-10 rounded-[2rem] shadow-card border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-8">Join the smart store today</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
              <User size={18} className="absolute left-4 top-[34px] text-gray-400" />
              <input name="name" value={form.name} placeholder="John Doe" className={inputClass} onChange={handleChange} />
            </div>

            <div className="relative text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
              <Mail size={18} className="absolute left-4 top-[34px] text-gray-400" />
              <input name="email" value={form.email} type="email" placeholder="hello@example.com" className={inputClass} onChange={handleChange} />
            </div>

            <div className="relative text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
              <Phone size={18} className="absolute left-4 top-[34px] text-gray-400" />
              <input name="phone" value={form.phone} placeholder="+1 234 567 890" className={inputClass} onChange={handleChange} />
            </div>

            <div className="relative text-left">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
              <Key size={18} className="absolute left-4 top-[34px] text-gray-400" />
              <input name="password" value={form.password} type="password" placeholder="••••••••" className={inputClass} onChange={handleChange} />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg mt-4 disabled:bg-gray-300">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <span onClick={() => navigate("/customer-login")} className="text-primary font-semibold cursor-pointer hover:underline">
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
