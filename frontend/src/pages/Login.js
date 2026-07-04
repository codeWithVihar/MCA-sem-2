import React, { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Settings, PenTool, Wrench, Hammer, Package, Truck, Box, Layers, ArrowLeft } from "lucide-react";

const iconsList = [Settings, PenTool, Wrench, Hammer, Package, Truck, Box, Layers];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [success, setSuccess] = useState(false);

  // Generate smooth floating elements
  const floatingElements = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const Icon = iconsList[Math.floor(Math.random() * iconsList.length)];
      const size = Math.random() * 60 + 40; // 40px to 100px
      const initialRotate = Math.random() * 360;

      return {
        id: i,
        Icon,
        size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.15 + 0.05, // 5% to 20% opacity

        // Floating Animation
        animateX: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
        animateY: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50],
        animateRotate: [initialRotate, initialRotate + (Math.random() > 0.5 ? 180 : -180)],

        duration: 20 + Math.random() * 20, // 20s to 40s for very slow, premium movement
      };
    });
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/login", { email, password });
      setStep(2);
      setTimer(60); // 60 sec timer
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    }

    setLoading(false);
  };

  /* ================= OTP VERIFY ================= */
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", { email, otp });

      setSuccess(true);

      setTimeout(() => {
        login(res.data.token, res.data.role, res.data.name);
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }

    setLoading(false);
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    try {
      await API.post("/auth/login", { email, password });
      setTimer(60);
      toast.success("OTP resent successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resending OTP");
    }
  };

  /* ================= TIMER LOGIC ================= */
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const inputClass = "w-full pl-4 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary transition bg-gray-50 focus:bg-white";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F4F6FB" }}>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated Gradient Orbs using requested colors */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ 
            background: "radial-gradient(circle, #C4D9FF 0%, rgba(196, 217, 255, 0) 70%)",
            top: "-20%", 
            left: "-10%" 
          }}
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, 50, 100, 50, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full blur-[140px]"
          style={{ 
            background: "radial-gradient(circle, rgba(197, 186, 255, 0.5) 0%, rgba(197, 186, 255, 0) 70%)",
            bottom: "-30%", 
            right: "-20%" 
          }}
          animate={{
            x: [0, -150, 0, 150, 0],
            y: [0, -100, -50, -100, 0],
            scale: [1, 1.2, 1, 1.2, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Icons */}
        {floatingElements.map((item) => (
          <motion.div
            key={item.id}
            className="absolute"
            style={{
              top: item.top,
              left: item.left,
              opacity: item.opacity,
              color: "#C5BAFF", // Using the light purple color
            }}
            animate={{
              x: item.animateX,
              y: item.animateY,
              rotate: item.animateRotate,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <item.Icon size={item.size} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-[400px] relative z-10 px-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-8 transition">
          <ArrowLeft size={16} /> Back to home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl shadow-card border border-white p-10 rounded-3xl transition-all duration-300"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Box size={24} className="text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {success ? "Welcome Back!" : step === 1 ? "Admin Access" : "Security Check"}
          </h2>
          <p className="text-sm text-center text-gray-500 mb-8">
            {success ? "Logging you in securely..." : step === 1 ? "Enter your credentials to continue" : "Verify your identity"}
          </p>

          {/* SUCCESS ANIMATION */}
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-emerald-500">✔</span>
              </div>
            </motion.div>
          )}

          {/* STEP 1 */}
          {!success && step === 1 && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="admin@smartstore.com"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all py-3.5 rounded-xl font-bold shadow-lg mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {!success && step === 2 && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="bg-indigo-50 p-4 rounded-xl text-center mb-6 border border-indigo-100">
                <p className="text-sm text-indigo-800">
                  We sent a code to <br /><span className="font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 text-center">One-Time Password</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  className="w-full py-4 rounded-xl text-center tracking-[0.5em] font-bold text-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary transition bg-gray-50 focus:bg-white"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all py-3.5 rounded-xl font-bold shadow-lg"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              {/* RESEND OTP */}
              <div className="text-center text-sm mt-4">
                {timer > 0 ? (
                  <span className="text-gray-400 font-medium">
                    Resend code in {timer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-indigo-600 font-semibold hover:underline transition-colors"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 mt-2 hover:text-gray-800 transition-colors"
              >
                ← Use a different account
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;