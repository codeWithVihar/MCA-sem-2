const User = require("../models/User");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      message: "User created successfully",
      data: user
    });

  } catch (error) {
    console.log("CREATE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER ROLE
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
