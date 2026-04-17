import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  LayoutDashboard,
  ShoppingCart,
  RotateCcw,
  Package,
  Truck,
  Users,
  ClipboardList,
  BarChart3,
  Bell,
  Menu,
  LogOut
} from "lucide-react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await API.get("/products/low-stock");
        setLowStockProducts(res.data.data || []);
      } catch (error) {

      }
    };

    fetchLowStock();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuSections = [
    {
      title: "Main",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard size={18} />
        },
        {
          label: "Analytics",
          path: "/analytics",
          icon: <BarChart3 size={18} />
        }
      ]
    },

    {
      title: "Sales",
      items: [
        {
          label: "Sales",
          path: "/sales",
          icon: <ShoppingCart size={18} />
        },
        {
          label: "Sales Return",
          path: "/sales-return",
          icon: <RotateCcw size={18} />
        }
      ]
    },

    {
      title: "Inventory",
      items: [
        {
          label: "Products",
          path: "/products",
          icon: <ClipboardList size={18} />
        },

        ...(role === "Admin" || role === "Manager"
          ? [
              {
                label: "Stock Manage",
                path: "/stock-manage",
                icon: <Package size={18} />
              },
              {
                label: "Purchase",
                path: "/purchase",
                icon: <Truck size={18} />
              }
            ]
          : [])
      ]
    },

    ...(role === "Admin"
      ? [
          {
            title: "Management",
            items: [
              {
                label: "Suppliers",
                path: "/suppliers",
                icon: <Users size={18} />
              },
              {
                label: "Audit Logs",
                path: "/audit",
                icon: <ClipboardList size={18} />
              }
            ]
          }
        ]
      : [])
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`bg-[#C5BAFF] text-white flex flex-col transition-all duration-300 shadow-xl ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* TOP */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">Inventory</h1>
              <p className="text-xs text-white/70">
                Management System
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-3 py-4">

          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">

              {!collapsed && (
                <p className="text-xs uppercase text-white/60 mb-2 px-3 tracking-wider">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        isActive
                          ? "bg-white text-black shadow font-medium"
                          : "text-white hover:bg-white/10"
                      }`
                    }
                  >
                    {item.icon}

                    {!collapsed && (
                      <span className="text-sm">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>

            </div>
          ))}

        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome, {role}
            </h2>

            <p className="text-sm text-gray-500">
            
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* NOTIFICATION */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(!showNotifications)
                }
                className="relative p-2 rounded-xl hover:bg-gray-100"
              >
                <Bell size={20} className="text-gray-700" />

                {lowStockProducts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {lowStockProducts.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border overflow-hidden z-50">

                  <div className="px-4 py-3 border-b font-semibold text-gray-800">
                    Low Stock Alerts
                  </div>

                  {lowStockProducts.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      No low stock products
                    </div>
                  ) : (
                    lowStockProducts.map((product) => (
                      <div
                        key={product._id}
                        className="px-4 py-3 border-b hover:bg-gray-50"
                      >
                        <p className="font-medium text-gray-800">
                          {product.productName}
                        </p>

                        <p className="text-sm text-red-500">
                          Stock Remaining: {product.currentStock}
                        </p>
                      </div>
                    ))
                  )}

                </div>
              )}
            </div>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[#C5BAFF] text-white px-4 py-2 rounded-xl hover:bg-[#b6a4ff] transition"
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default Layout;