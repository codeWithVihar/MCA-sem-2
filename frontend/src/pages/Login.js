import React, { useState, useEffect, useMemo } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = ({ setAuth }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [success, setSuccess] = useState(false);

  // Expanded tools list including your new decorative additions
  const toolsList = ["🔧", "🔩", "⚙️", "🔨", "⛓️", "🛠️", "⛏️", "🪚"];

  // Generate a messy scattered layout with floating animation parameters once on load
  const scatteredFloatingTools = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Calculate random initial rotation as a number for keyframes
      const initialRotateDeg = Math.random() * 360;
      
      return {
        id: i,
        tool: toolsList[Math.floor(Math.random() * toolsList.length)],
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 0.8 + 1}rem`, // Smaller size range

        // Floating Animation Parameters
        animateX: [0, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, 0], // Small random drifts
        animateY: [0, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, 0], // Small random drifts
        
        // Full rotation loop keyframes starting from random initial rotation
        animateRotate: [initialRotateDeg, initialRotateDeg + 360, initialRotateDeg],
        
        // Random duration for each element's animation cycle (between 12 and 22 seconds)
        duration: 12 + Math.random() * 10,
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
alert("Invalid email or password")
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
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setAuth(true);
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
alert("Invalid or expired OTP")
    }

    setLoading(false);
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    try {
      await API.post("/auth/login", { email, password });
      setTimer(60);
    } catch (err) {
alert("Error resending OTP")
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

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, #E8F9FF, #C5BAFF)`,
      }}
    >
      {/* Floating, Messy, Unaligned, Smaller, and Visible Hardware Tools */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 z-00">
        {scatteredFloatingTools.map((item) => (
          <motion.div
            key={item.id}
            className="absolute flex items-center justify-center drop-shadow-md text-gray-900"
            style={{
              top: item.top,
              left: item.left,
              fontSize: item.fontSize,
            }}
            animate={{
              x: item.animateX,
              y: item.animateY,
              rotate: item.animateRotate,
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut", // Smooth drifting and rotating
            }}
          >
            {item.tool}
          </motion.div>
        ))}
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute w-72 h-72 bg-[#C4D9FF] blur-3xl rounded-full -top-10 -left-10 opacity-60 pointer-events-none z-1"></div>
      <div className="absolute w-80 h-80 bg-[#a190ff] blur-3xl rounded-full -bottom-16 right-0 opacity-40 pointer-events-none z-1"></div>

      {/* Main Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/40 shadow-2xl p-10 rounded-3xl border border-white/50 w-[380px] transition-all duration-300 relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight">
          {success ? "Welcome!" : step === 1 ? "Login" : "Verify OTP"}
        </h2>

        {/* SUCCESS ANIMATION */}
        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center text-5xl text-green-600 mb-4 drop-shadow-md"
          >
            ✔
          </motion.div>
        )}

        {/* STEP 1 */}
        {!success && step === 1 && (
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3.5 rounded-xl bg-white/70 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#9a8aff] text-gray-800 placeholder-gray-500 shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3.5 rounded-xl bg-white/70 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#9a8aff] text-gray-800 placeholder-gray-500 shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b3a8ff] to-[#9a8aff] hover:from-[#a190ff] hover:to-[#8370ff] text-white transition-all p-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {!success && step === 2 && (
          <form onSubmit={handleOtpVerify} className="space-y-5">
            <p className="text-center text-sm text-gray-600">
              OTP sent to <span className="font-semibold text-gray-800">{email}</span>
            </p>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="w-full p-3.5 rounded-xl text-center tracking-[0.3em] font-semibold text-xl bg-white/70 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#9a8aff] text-gray-800 shadow-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b3a8ff] to-[#9a8aff] hover:from-[#a190ff] hover:to-[#8370ff] text-white transition-all p-3.5 rounded-xl font-bold shadow-lg flex justify-center"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND OTP */}
            <div className="text-center text-sm mt-3">
              {timer > 0 ? (
                <span className="text-gray-500 font-medium">
                  Resend OTP in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-[#6B46C1] hover:text-[#553C9A] font-semibold hover:underline transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-500 mt-2 hover:text-gray-800 transition-colors"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;