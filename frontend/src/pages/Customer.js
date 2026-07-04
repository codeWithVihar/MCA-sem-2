import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../components/CustomerLayout";
import CartDrawer from "../components/CartDrawer";
import { toast } from "react-toastify";
import { Search, ShoppingCart, Image as ImageIcon } from "lucide-react";

const Customer = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data.data || []))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || p.category === category)
  );

  const getStockStatus = (p) => {
    if (p.currentStock === 0) return { label: "Out of Stock", class: "bg-red-100 text-red-600" };
    if (p.currentStock <= p.minStockLevel) return { label: "Low Stock", class: "bg-amber-100 text-amber-700" };
    return { label: "In Stock", class: "bg-emerald-100 text-emerald-700" };
  };

  const addToCart = (product) => {
    if (product.currentStock === 0) return toast.warn("Out of stock ❌");
    
    const exist = cart.find(i => i._id === product._id);
    if (exist) {
      if (exist.quantity + 1 > product.currentStock) return toast.warn(`Only ${product.currentStock} available`);
      setCart(cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      if (1 > product.currentStock) return toast.warn(`Only ${product.currentStock} available`);
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success("Added to cart");
  };

  return (
    <CustomerLayout cart={cart}>
      {/* Search & Categories */}
      <div className="mb-8 space-y-6">
        <div className="flex gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map(p => {
          const status = getStockStatus(p);
          return (
            <div key={p._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-card-hover transition-all duration-300 group relative flex flex-col h-full">
              
              <span className={`absolute top-4 left-4 text-[10px] font-bold px-2 py-1 rounded-md z-10 ${status.class}`}>
                {status.label}
              </span>

              <div className="h-40 bg-gray-50 rounded-xl mb-4 overflow-hidden relative flex-shrink-0 flex items-center justify-center group-hover:bg-gray-100 transition">
                {p.images ? (
                  <img
                    src={`http://localhost:5000/uploads/${p.images}`}
                    alt={p.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-xs text-gray-400 font-medium mb-1">{p.brand || "Generic"} • {p.category}</p>
                <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{p.productName}</h3>
                
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price</p>
                    <p className="text-lg font-black text-indigo-600">₹{p.sellingPrice}</p>
                  </div>
                  
                  <button
                    disabled={p.currentStock === 0}
                    onClick={() => addToCart(p)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                      p.currentStock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-900 text-white hover:bg-primary hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <Search size={48} className="opacity-20" />
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-3 z-40 animate-fade-in"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span className="font-semibold text-sm">View Cart</span>
        </button>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        setCart={setCart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        navigate={navigate}
      />
    </CustomerLayout>
  );
};

export default Customer;