const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* REGISTER */
exports.register = async (req, res) => {

  try {

    const { name, email, phone, password } = req.body;

    const exist = await Customer.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone,
      password: hashed
    });

    res.json({
      success: true,
      message: "Registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};


/* LOGIN */
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, customer.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer._id, role: "Customer" },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      customer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};