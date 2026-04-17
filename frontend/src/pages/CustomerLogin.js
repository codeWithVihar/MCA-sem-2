import React, { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const login = async () => {

    try {

      const res = await API.post("/customers/login", form);

      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customer", JSON.stringify(res.data.customer));

      navigate("/customer");

    } catch {
      toast.error("Login failed");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF]">

      <div className="bg-white p-8 rounded-xl shadow w-96">

        <h2 className="text-xl font-bold mb-4">Customer Login</h2>

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 border mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border mb-3"
          onChange={handleChange}
        />

        <button
          onClick={login}
          className="w-full bg-primary text-white py-2 rounded"
        >
          Login
        </button>
        <p className="text-center mt-4">
  Don't have an account?{" "}
  <span
    onClick={() => navigate("/customer-register")}
    className="text-blue-600 cursor-pointer"
  >
    Register
  </span>
</p>

      </div>

    </div>
  );
};

export default CustomerLogin;
