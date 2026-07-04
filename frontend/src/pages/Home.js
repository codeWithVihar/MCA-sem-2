import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Box, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">

      {/* Floating Navbar */}
      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl z-50">
        <div className="bg-white/80 backdrop-blur-xl shadow-lg border border-gray-100 rounded-2xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
              <Box size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">SmartStore</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition text-sm"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate("/customer")}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2"
            >
              Storefront <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Background Ornaments */}
      <div className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -top-20 -left-20 animate-pulse-soft"></div>
      <div className="absolute w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] bottom-0 right-0 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center pt-48 px-6 relative z-10">
        <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Inventory System 2.0</span>
        </div>

        <h1 data-aos="fade-up" className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight mb-8 max-w-4xl">
          Manage your inventory <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#D34BEA]">
            intelligently.
          </span>
        </h1>

        <p data-aos="fade-up" data-aos-delay="200" className="text-gray-500 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          The all-in-one platform for hardware stores. Track stock, manage sales, process returns, and gain insights with beautiful analytics.
        </p>

        {/* Buttons */}
        <div data-aos="fade-up" data-aos-delay="400" className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/customer")}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-[#D34BEA] text-white font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
          >
            Start Shopping
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-xl bg-white text-gray-700 font-bold shadow-md hover:shadow-lg border border-gray-100 hover:-translate-y-1 transition-all text-lg"
          >
            Access Dashboard
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto mt-32 pb-24 relative z-10">
        {[
          { title: "Real-time Tracking", desc: "Monitor stock levels instantly with automated low-stock alerts.", color: "text-primary", bg: "bg-soft" },
          { title: "Smart POS Billing", desc: "Generate invoices quickly with built-in GST and discount calculations.", color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Insightful Analytics", desc: "Visualize your business growth with beautiful charts and reports.", color: "text-[#D34BEA]", bg: "bg-purple-50" },
        ].map((feature, i) => (
          <div
            key={i}
            data-aos="fade-up"
            data-aos-delay={i * 200}
            className="bg-white p-8 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 group"
          >
            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Box size={24} className={feature.color} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
            <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-sm border-t border-gray-200/50">
        © {new Date().getFullYear()} SmartStore Management System. Designed for scale.
      </div>
    </div>
  );
};

export default Home;