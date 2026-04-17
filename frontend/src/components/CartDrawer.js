import React from "react";

const CartDrawer = ({ cart, setCart, isOpen, onClose, navigate }) => {

  const updateQty = (id, change) => {

    setCart(cart.map(item =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));

  };

  const removeItem = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const total = cart.reduce(
    (sum, i) => sum + i.sellingPrice * i.quantity,
    0
  );

  return (

    <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}>

      {/* HEADER */}
      <div className="p-5 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Cart 🛒</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {/* ITEMS */}
      <div className="p-4 space-y-4 overflow-y-auto h-[70%]">

        {cart.length === 0 && (
          <p className="text-gray-400">Cart is empty</p>
        )}

        {cart.map(item => (

          <div key={item._id} className="border p-3 rounded-lg">

            <div className="flex justify-between">
              <p className="font-medium">{item.productName}</p>
              <button onClick={() => removeItem(item._id)}>❌</button>
            </div>

            <p className="text-sm text-gray-500">
              ₹{item.sellingPrice}
            </p>

            {/* QUANTITY */}
            <div className="flex items-center gap-3 mt-2">

              <button
                onClick={() => updateQty(item._id, -1)}
                className="px-2 bg-gray-200 rounded"
              >-</button>

              <span>{item.quantity}</span>

              <button
                onClick={() => updateQty(item._id, 1)}
                className="px-2 bg-gray-200 rounded"
              >+</button>

            </div>

          </div>

        ))}

      </div>

      {/* FOOTER */}
      <div className="p-5 border-t">

        <div className="flex justify-between mb-4 font-semibold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          onClick={() => navigate("/checkout", { state: { cart } })}
          className="w-full bg-primary text-white py-3 rounded-lg"
        >
          Checkout 🚀
        </button>

      </div>

    </div>
  );
};

export default CartDrawer;