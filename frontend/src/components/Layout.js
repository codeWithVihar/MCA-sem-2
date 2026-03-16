import React, { useState, useEffect } from "react";
import API from "../services/api";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  RotateCcw,
  Package,
  BarChart3,
  ClipboardList,
  Users,
  Truck,
  LogOut,
  Bell,
  Menu
} from "lucide-react";



const Layout = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [collapsed, setCollapsed] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);// later connect to API
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);  
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 relative ${
      isActive
        ? "bg-white text-black font-semibold shadow"
        : "hover:bg-[#C4D9FF] hover:text-black"
    }`;
useEffect(() => {
  

  const fetchLowStock = async () => {

    try {

      const res = await API.get("/products/low-stock");

      setLowStockProducts(res.data.data);
      setLowStockCount(res.data.count);

    } catch (error) {

      console.log("Low stock error:", error);

    }

  };

  fetchLowStock();

}, []);



  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-[#C5BAFF] text-white shadow-xl flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold tracking-wide">
              Inventory
            </h2>
          )}

          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-2 text-sm overflow-y-auto">

          <NavLink to="/dashboard" className={navStyle}>
            <LayoutDashboard size={18} />
            {!collapsed && "Dashboard"}
          </NavLink>

          <NavLink to="/sales" className={navStyle}>
            <ShoppingCart size={18} />
            {!collapsed && "Sales"}
          </NavLink>

          <NavLink to="/sales-return" className={navStyle}>
            <RotateCcw size={18} />
            {!collapsed && "Sales Return"}
          </NavLink>

          {(role === "Admin" || role === "Manager") && (
            <NavLink to="/stock-manage" className={navStyle}>
              <Package size={18} />
              {!collapsed && "Stock Manage"}
            </NavLink>
          )}

          {(role === "Admin" || role === "Manager") && (
            <NavLink to="/purchase" className={navStyle}>
              <Truck size={18} />
              {!collapsed && "Purchase"}
            </NavLink>
          )}

          <NavLink to="/products" className={navStyle}>
            <ClipboardList size={18} />
            {!collapsed && "Products"}
          </NavLink>

          {role === "Admin" && (
            <NavLink to="/add-product" className={navStyle}>
              <Package size={18} />
              {!collapsed && "Create Product"}
            </NavLink>
          )}

          <NavLink to="/analytics" className={navStyle}>
            <BarChart3 size={18} />
            {!collapsed && "Analytics"}
          </NavLink>

          {(role === "Admin" || role === "Manager") && (
            <NavLink to="/staff" className={navStyle}>
              <Users size={18} />
              {!collapsed && "Staff Manage"}
            </NavLink>
          )}

          {role === "Admin" && (
            <NavLink to="/audit" className={navStyle}>
              <ClipboardList size={18} />
              {!collapsed && "Audit Logs"}
            </NavLink>
          )}

        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 m-4 bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-red-100 transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white p-4 shadow-sm">

          <h3 className="text-lg font-semibold text-gray-700">
            Welcome, {role}
          </h3>

          <div className="flex items-center gap-6">

            {/* Notification */}
          <div className="relative">

  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative"
  >
    <Bell size={20} />

    {lowStockCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
        {lowStockCount}
      </span>
    )}
  </button>

  {/* Notification Dropdown */}
  {showNotifications && (
    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border z-50">

      <div className="p-3 border-b font-semibold">
        Low Stock Alerts
      </div>

      <div className="max-h-60 overflow-y-auto">

        {lowStockProducts.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">
            No low stock items
          </p>
        ) : (
          lowStockProducts.map(product => (
            <div
              key={product._id}
              className="p-3 border-b hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">
                ⚠ {product.productName}
              </p>

              <p className="text-sm text-gray-500">
                Stock: {product.currentStock}
              </p>
            </div>
          ))
        )}

      </div>

    </div>
  )}

</div>

            <button
              onClick={logout}
              className="bg-[#C5BAFF] text-white px-4 py-2 rounded-lg hover:bg-[#C4D9FF] hover:text-black transition"
            >
              Logout
            </button>

          </div>

        </div>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;