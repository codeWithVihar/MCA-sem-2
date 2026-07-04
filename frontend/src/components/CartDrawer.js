import React from "react";
import { X, ShoppingCart, ArrowRight } from "lucide-react";

const CartDrawer = ({ cart, setCart, isOpen, onClose, navigate }) => {
  if (!isOpen) return null;

  const total = cart.reduce((sum, i) => sum + i.sellingPrice * i.quantity, 0);

  const increaseQty = (item) => {
    if (item.quantity >= item.currentStock) return;
    setCart(cart.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
  };

  const decreaseQty = (item) => {
    if (item.quantity <= 1) {
      setCart(cart.filter((i) => i._id !== item._id));
    } else {
      setCart(cart.map((i) => i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i));
    }
  };

  const remove = (id) => setCart(cart.filter((i) => i._id !== id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={22} className="text-indigo-500" />
            Your Cart
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800 text-sm leading-tight">{item.productName}</h4>
                      <button onClick={() => remove(item._id)} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-indigo-600 font-bold text-sm mt-1">₹{item.sellingPrice}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button onClick={() => decreaseQty(item)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-primary">-</button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQty(item)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-primary">+</button>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">₹{item.sellingPrice * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium text-sm">Total Amount</span>
              <span className="text-2xl font-bold text-gray-800">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout", { state: { cart } });
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;