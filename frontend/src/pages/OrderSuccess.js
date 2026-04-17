import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return <p className="text-center mt-20">No order found</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C5BAFF] to-[#C4D9FF]">

      <div className="bg-white p-10 rounded-xl shadow-xl text-center">

        <h2 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed!
        </h2>

        {/* <p className="mb-2">
          Order ID: <b>{order._id}</b>
        </p> */}

        <p className="mb-6">
          We will process your order soon.
        </p>

        <button
          onClick={() => navigate("/customer")}
          className="bg-primary px-6 py-2 rounded-lg text-white"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
};

export default OrderSuccess;