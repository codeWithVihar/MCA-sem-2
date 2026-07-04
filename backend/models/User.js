const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },

    password: { type: String, required: true, minlength: 6 },
    

    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff"],
      default: "Staff",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

// 🔐 Password hashing middleware
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


// Auto-expire OTP documents after 10 minutes
userSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("User", userSchema);
