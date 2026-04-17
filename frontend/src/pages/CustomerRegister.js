import React, { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CustomerRegister = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE ================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SUBMIT ================= */

  const handleRegister = async () => {

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill required fields");
      return;
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

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF]">

      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-[400px]">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Join our smart inventory store
        </p>

        {/* INPUTS */}

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-[#C5BAFF]"
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-[#C5BAFF]"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-[#C5BAFF]"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-[#C5BAFF]"
          onChange={handleChange}
        />

        {/* BUTTON */}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-[#C5BAFF] hover:bg-[#C4D9FF] text-black py-3 rounded-lg transition font-semibold"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* LOGIN LINK */}

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/customer-login")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
};

export default CustomerRegister;
