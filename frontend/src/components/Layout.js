import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  LogOut,
  ChevronLeft,
  UserCircle,
} from "lucide-react";

const Layout = ({ children }) => {
  const { role, name, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await API.get("/products/low-stock");
        setLowStockProducts(res.data.data || []);
      } catch (error) { console.error("Low stock fetch failed", error); }
    };
    fetchLowStock();
  }, []);

  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuSections = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { label: "Analytics", path: "/analytics", icon: <BarChart3 size={20} /> },
      ],
    },
    {
      title: "Sales",
      items: [
        { label: "Sales", path: "/sales", icon: <ShoppingCart size={20} /> },
        { label: "Sales Return", path: "/sales-return", icon: <RotateCcw size={20} /> },
      ],
    },
    {
      title: "Inventory",
      items: [
        { label: "Products", path: "/products", icon: <ClipboardList size={20} /> },
        ...(role === "Admin" || role === "Manager"
          ? [
              { label: "Stock Manage", path: "/stock-manage", icon: <Package size={20} /> },
              { label: "Purchase", path: "/purchase", icon: <Truck size={20} /> },
            ]
          : []),
      ],
    },
    ...(role === "Admin"
      ? [
          {
            title: "Management",
            items: [
              { label: "Staff", path: "/staff", icon: <Users size={20} /> },
              { label: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
              { label: "Audit Logs", path: "/audit", icon: <ClipboardList size={20} /> },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`bg-gradient-to-b from-sidebar to-[#b4a8ee] text-white flex flex-col transition-all duration-300 shadow-2xl z-50 ${
          collapsed ? "w-[80px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 relative overflow-hidden">
          {/* Subtle glow behind logo */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          {!collapsed && (
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
                <Package size={20} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold tracking-wide drop-shadow-sm">Smart Inventory</h1>
                <p className="text-[10px] text-white/70 tracking-wider uppercase font-medium">Management</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/15 transition-all text-white/80 hover:text-white relative z-10"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-hide">
          {menuSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="text-[10px] uppercase text-white/60 font-bold mb-3 px-2 tracking-[0.15em]">
                  {section.title}
                </p>
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-white text-[#7d6bc4] shadow-[0_8px_16px_rgba(0,0,0,0.08)] font-semibold translate-x-1"
                          : "text-white/80 hover:text-white hover:bg-white/10 hover:translate-x-1"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={`transition-colors duration-300 ${isActive ? "text-[#a090e0]" : "text-white/70 group-hover:text-white"}`}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-[13.5px] tracking-wide">{item.label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Profile Area */}
        <div className="p-3 m-3 mt-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner transition-all hover:bg-white/15">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed && (
              <div className="flex items-center gap-3 overflow-hidden pl-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white/30 to-white/10 flex items-center justify-center flex-shrink-0 shadow-sm border border-white/20">
                  <span className="text-sm font-bold text-white drop-shadow-md">
                    {role ? role.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-white truncate drop-shadow-sm">{role}</p>
                  <p className="text-[10px] text-white/70 truncate uppercase tracking-wider">Active</p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className={`p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-rose-500/80 hover:shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all ${collapsed ? "w-full flex justify-center" : ""}`}
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-secondary" />
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Welcome back{name ? `, ${name}` : ''}</h2>
              <p className="text-xs text-gray-400">{role} Account</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition"
              >
                <Bell size={18} className="text-gray-600" />
                {lowStockProducts.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent-rose text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {lowStockProducts.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="font-semibold text-gray-800 text-sm">Low Stock Alerts</p>
                    <p className="text-xs text-gray-400">{lowStockProducts.length} items need attention</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {lowStockProducts.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-400">
                        All stock levels healthy ✅
                      </div>
                    ) : (
                      lowStockProducts.map((product) => (
                        <div key={product._id} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition">
                          <p className="font-medium text-gray-800 text-sm">{product.productName}</p>
                          <p className="text-xs text-accent-rose font-medium">
                            ⚠ Only {product.currentStock} left
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-xl transition text-sm font-medium shadow-sm"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;