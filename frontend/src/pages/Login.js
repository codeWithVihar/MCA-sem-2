import React, { useState, useEffect } from "react";
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

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/login", { email, password });
      setStep(2);
      setTimer(60); // 60 sec timer
    } catch (err) {
      alert("Invalid email or password");
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
      alert("Invalid or expired OTP");
    }

    setLoading(false);
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    try {
      await API.post("/auth/login", { email, password });
      setTimer(60);
    } catch (err) {
      alert("Error resending OTP");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F9FF] to-[#C5BAFF] relative overflow-hidden">

      <div className="absolute w-72 h-72 bg-[#C4D9FF] blur-3xl rounded-full -top-10 -left-10 opacity-40"></div>
      <div className="absolute w-80 h-80 bg-[#C5BAFF] blur-3xl rounded-full -bottom-16 right-0 opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-white/30 shadow-xl p-10 rounded-2xl border border-white/20 w-[380px] transition-all duration-300"
      >

        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          {success ? "Welcome!" : step === 1 ? "Login" : "Verify OTP"}
        </h2>

        {/* SUCCESS ANIMATION */}
        {success && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center text-4xl text-green-600 mb-4"
          >
            ✔
          </motion.div>
        )}

        {/* STEP 1 */}
        {!success && step === 1 && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-[#C5BAFF]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-[#C5BAFF]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5BAFF] hover:bg-[#b7afff] transition p-3 rounded-xl font-semibold shadow-md flex justify-center items-center"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {!success && step === 2 && (
          <form onSubmit={handleOtpVerify} className="space-y-4">

            <p className="text-center text-sm text-black/70">
              OTP sent to <span className="font-semibold">{email}</span>
            </p>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="w-full p-3 rounded-xl text-center tracking-widest text-xl bg-white/60 border border-white/40 focus:ring-2 focus:ring-[#C5BAFF]"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5BAFF] hover:bg-[#b7afff] transition p-3 rounded-xl font-semibold shadow-md flex justify-center"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND OTP */}
            <div className="text-center text-sm mt-2">
              {timer > 0 ? (
                <span className="text-black/60">
                  Resend OTP in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-black/70 mt-2 hover:underline"
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