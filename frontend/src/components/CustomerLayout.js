import React, { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useNavigate } from "react-router-dom";

const CustomerLayout = ({ children, cart = [] }) => {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const customer = JSON.parse(localStorage.getItem("customer"));
    const [cartOpen, setCartOpen] = useState(false);
  const logout = () => {
    localStorage.removeItem("customer");
    navigate("/customer-login");
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF]">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-md px-8 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/customer")}
          className="text-xl font-bold cursor-pointer"
        >
          🛍️ Smart Store
        </h1>

        {/* SEARCH */}
        {/* <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 rounded-xl border w-96 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* CART */}
          <button
            onClick={() => setCartOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            🛒 {cart.length}

            
          </button>

          {/* PROFILE */}
          <button
            onClick={() => navigate("/customer-profile")}
            className="bg-white px-4 py-2 rounded-lg shadow"
          >
            👤 {customer?.name || "Profile"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="text-red-500 font-medium"
          >
            Logout
          </button>

        </div>

      </div>

      {/* PAGE CONTENT */}
      <div className="p-8">
        {children}
      </div>
      
      
    </div>
    
);
};

export default CustomerLayout;