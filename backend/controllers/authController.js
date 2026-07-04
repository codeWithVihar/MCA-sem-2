const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prevent self-assignment of role - always default to Staff
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "Staff"  // Force Staff role on self-registration
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* ================= LOGIN (STEP 1 - PASSWORD CHECK) ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry (5 minutes)
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP to email
    try {
      await sendEmail(
        user.email,
        "Your Login OTP - Smart Inventory",
        `Your OTP is ${otp}. It expires in 5 minutes.`
      );
      console.log(`[OTP LOG] OTP successfully emailed to ${user.email}`);
    } catch (emailError) {
      console.warn(`[OTP LOG] Email sending failed: ${emailError.message}`);
    }
    // Always log to console for development/test visibility
    // OTP logged for dev only - do not log in production

    res.json({
      success: true,
      message: "OTP sent to your email",
      email: user.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= VERIFY OTP (STEP 2 - ISSUE TOKEN) ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Clear OTP after success
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};