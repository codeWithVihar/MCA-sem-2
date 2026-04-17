const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================= GET ALL USERS ================= */

exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {



    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ================= CREATE USER ================= */

exports.createUser = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    /* HASH PASSWORD */

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({

      name,
      email,
      password: hashedPassword,
      role: role || "Staff"

    });

    res.status(201).json({

      success: true,
      message: "User created successfully",

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }

    });

  } catch (error) {



    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ================= UPDATE USER ROLE ================= */

exports.updateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.params.id,

      { role: req.body.role },

      { new: true }

    ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.json({
      success: true,
      message: "User role updated",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ================= DEACTIVATE USER ================= */

exports.deactivateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.params.id,

      { isActive: false },

      { new: true }

    ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.json({
      success: true,
      message: "User deactivated",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



/* ================= ACTIVATE USER ================= */

exports.activateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(

      req.params.id,

      { isActive: true },

      { new: true }

    ).select("-password");

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.json({
      success: true,
      message: "User activated",
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};