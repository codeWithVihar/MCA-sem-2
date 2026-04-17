import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#e0f2fe] overflow-hidden">

      {/* 🔥 FLOATING NAVBAR */}
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="bg-white/40 backdrop-blur-xl shadow-lg rounded-2xl px-6 py-4 flex justify-between items-center">

          <h2 className="text-xl font-bold text-indigo-700">
            Smart Inventory
          </h2>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:scale-105 transition"
            >
              Admin
            </button>

            <button
              onClick={() => navigate("/customer")}
              className="px-5 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
            >
              Customer
            </button>
          </div>

        </div>
      </div>

      {/* 🔥 BACKGROUND BLOBS */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      {/* 🔥 HERO */}
      <div className="flex flex-col items-center justify-center text-center pt-40 px-6">

        <h1
          data-aos="fade-up"
          className="text-6xl font-extrabold text-gray-800 leading-tight mb-6"
        >
          Smart Inventory <br />
          <span className="text-indigo-600">
            Management System
          </span>
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-gray-600 text-lg max-w-2xl mb-10"
        >
          Manage products, sales, purchases, and analytics —
          all in one intelligent dashboard designed for modern businesses.
        </p>

        {/* 🔥 BUTTONS */}
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="flex gap-6"
        >

          <button
            onClick={() => navigate("/customer")}
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white shadow-lg hover:shadow-indigo-400/50 hover:scale-105 transition"
          >
            Start Ordering
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-white/50 backdrop-blur-md shadow hover:bg-white/70 transition"
          >
            Admin Panel
          </button>

        </div>

      </div>

      {/* 🔥 FEATURES */}
      <div className="grid md:grid-cols-3 gap-10 px-10 mt-32 pb-20">

        <div
          data-aos="zoom-in"
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Inventory Tracking
          </h3>
          <p className="text-gray-600">
            Monitor stock levels in real-time with smart alerts and automation.
          </p>
        </div>

        <div
          data-aos="zoom-in"
          data-aos-delay="200"
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Smart Billing
          </h3>
          <p className="text-gray-600">
            Fast invoice generation with GST, discounts, and multi-item billing.
          </p>
        </div>

        <div
          data-aos="zoom-in"
          data-aos-delay="400"
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-3">
            Advanced Analytics
          </h3>
          <p className="text-gray-600">
            Gain insights into sales, profit, and stock trends with visual dashboards.
          </p>
        </div>

      </div>

      {/* 🔥 CTA SECTION */}
      <div className="text-center py-20">

        <h2
          data-aos="fade-up"
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Ready to transform your business?
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="text-gray-500 mb-6"
        >
          Start managing your inventory smarter today.
        </p>

        <button
          data-aos="fade-up"
          data-aos-delay="400"
          onClick={() => navigate("/customer")}
          className="px-10 py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
        >
          Get Started
        </button>

      </div>

      {/* 🔥 FOOTER */}
      <div className="text-center pb-6 text-gray-500 text-sm">
        © 2026 Smart Inventory System • Built with ❤️
      </div>

    </div>
  );
};

export default Home;