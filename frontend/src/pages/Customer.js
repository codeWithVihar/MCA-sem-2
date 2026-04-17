import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../components/CustomerLayout";
import CartDrawer from "../components/CartDrawer";

const Customer = () => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* ================= LOAD PRODUCTS ================= */

  useEffect(() => {
    API.get("/products")
      .then(res => setProducts(res.data.data || []))
      .catch(() => alert("Failed to load products"));
  }, []);

  /* ================= CATEGORY ================= */

  const categories = [
    "All",
    ...new Set(products.map(p => p.category).filter(Boolean))
  ];

  /* ================= FILTER ================= */

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || p.category === category)
  );

  /* ================= STOCK STATUS ================= */

  const getStockStatus = (p) => {
    if (p.currentStock === 0) return "OUT";
    if (p.currentStock <= p.minStockLevel) return "LOW";
    return "IN";
  };

  const getStockStyle = (status) => {
    switch (status) {
      case "OUT":
        return "bg-red-100 text-red-600";
      case "LOW":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  /* ================= CART ================= */

  const addToCart = (product, qty = 1) => {

    if (product.currentStock === 0) {
      return alert("Out of stock ❌");
    }

    const exist = cart.find(i => i._id === product._id);

    if (exist) {

      const newQty = exist.quantity + qty;

      if (newQty > product.currentStock) {
        return alert(`Only ${product.currentStock} available`);
      }

      setCart(cart.map(i =>
        i._id === product._id
          ? { ...i, quantity: newQty }
          : i
      ));

    } else {

      if (qty > product.currentStock) {
        return alert(`Only ${product.currentStock} available`);
      }

      setCart([...cart, { ...product, quantity: qty }]);
    }

    setCartOpen(true);
    setSelected(null);
  };

  const total = cart.reduce(
    (sum, i) => sum + i.sellingPrice * i.quantity,
    0
  );

  /* ================= UI ================= */

  return (
    <CustomerLayout cart={cart}>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          🛍️ Smart Store
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 rounded-xl border shadow focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setCartOpen(true)}
            className="bg-white px-4 py-2 rounded-xl shadow hover:bg-gray-100"
          >
            🛒 ({cart.length})
          </button>

        </div>

      </div>

      {/* MAIN */}
      <div className="grid grid-cols-5 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white/80 p-5 rounded-2xl shadow">

          <h3 className="font-semibold mb-4">Categories</h3>

          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setCategory(cat)}
              className={`cursor-pointer px-3 py-2 rounded-lg text-sm mb-1 ${
                category === cat
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </div>
          ))}

        </div>

        {/* PRODUCTS */}
        <div className="col-span-4 grid grid-cols-4 gap-6">

          {filteredProducts.map(p => {

            const status = getStockStatus(p);

            return (
              <div
                key={p._id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-2xl transition relative group border"
              >

                {/* STOCK BADGE */}
                <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${getStockStyle(status)}`}>
                  {status === "OUT" ? "Out of Stock" : status === "LOW" ? "Low Stock" : "In Stock"}
                </span>

                {/* IMAGE */}
                <div
                  onClick={() => setSelected(p)}
                  className="h-40 bg-gray-100 rounded-xl mb-3 overflow-hidden cursor-pointer"
                >
                  {p.images ? (
                    <img
src={`http://localhost:5000/uploads/${p.images}`}
                      alt={p.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* ADD BUTTON */}
                <button
                  disabled={status === "OUT"}
                  onClick={() => addToCart(p)}
                  className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-lg shadow transition
                    ${status === "OUT"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-primary text-white opacity-0 group-hover:opacity-100"
                    }`}
                >
                  + Add
                </button>

                <h3
                  onClick={() => setSelected(p)}
                  className="font-semibold text-lg cursor-pointer"
                >
                  {p.productName}
                </h3>

                <p className="text-xs text-gray-500">
                  {p.brand} • {p.unit}
                </p>

                <p className="text-primary font-bold text-xl mt-1">
                  ₹{p.sellingPrice}
                </p>

                {/* <p className="text-xs text-gray-400">
                  Stock: {p.currentStock}
                </p> */}

              </div>
            );
          })}

        </div>

      </div>

      {/* PRODUCT MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[450px] relative shadow-xl">

            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <div className="h-56 bg-gray-100 rounded-xl overflow-hidden mb-4">
              {selected.images && (
                <img
src={`http://localhost:5000/uploads/${selected.images}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h2 className="text-2xl font-bold">
              {selected.productName}
            </h2>

            <p className="text-gray-500">
              {selected.brand} • {selected.category}
            </p>

            <p className="text-sm text-gray-400">
              Unit: {selected.unit}
            </p>

            <p className="text-xl text-primary font-bold mt-2">
              ₹{selected.sellingPrice}
            </p>

            {/* <p className="text-sm text-gray-400">
              Stock: {selected.currentStock}
            </p> */}

            <button
              disabled={selected.currentStock === 0}
              onClick={() => addToCart(selected)}
              className={`mt-5 w-full py-3 rounded-xl transition
                ${selected.currentStock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-secondary"
                }`}
            >
              {selected.currentStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

          </div>

        </div>
      )}

      {/* CART */}
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