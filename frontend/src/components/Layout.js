import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navStyle = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition duration-200 ${
      isActive
        ? "bg-white text-black font-semibold shadow"
        : "hover:bg-[#C4D9FF] hover:text-black"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-[#C5BAFF] text-white p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Inventory
        </h2>

        <nav className="space-y-3 text-sm">

          <NavLink to="/dashboard" className={navStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/sales" className={navStyle}>
            Sales
          </NavLink>

          <NavLink to="/analytics" className={navStyle}>
            Analytics
          </NavLink>

          {(role === "Admin" || role === "Manager") && (
            <NavLink to="/stock-manage" className={navStyle}>
              Stock Manage
            </NavLink>
          )}

          {role === "Admin" && (
            <>
              <NavLink to="/add-product" className={navStyle}>
                Add Product
              </NavLink>

              <NavLink to="/audit" className={navStyle}>
                Audit Logs
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Welcome, {role}
          </h3>

          <button
            onClick={logout}
            className="bg-[#C5BAFF] text-white px-5 py-2 rounded-lg shadow hover:bg-[#C4D9FF] hover:text-black transition"
          >
            Logout
          </button>
        </div>

        {/* Centered Page Container */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
