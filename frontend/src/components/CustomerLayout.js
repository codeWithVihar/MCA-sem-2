import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Box } from "lucide-react";

const CustomerLayout = ({ children, cart = [] }) => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer"));

  const logout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
        <div 
          onClick={() => navigate("/customer")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Box size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">SmartStore</h1>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate("/customer-profile")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-indigo-100"
          >
            <User size={16} className="text-gray-400 group-hover:text-indigo-500" />
            <span className="font-medium">{customer?.name || "Guest"}</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition font-medium bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;