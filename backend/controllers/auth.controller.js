const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const { Company, User } = require("../models");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, companyName, country } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // 🌍 Get currency from API
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,currencies"
    );

    const countryData = response.data.find(
      (c) => c.name.common.toLowerCase() === country.toLowerCase()
    );
    if (!countryData || !countryData.currencies) {
        return res.status(400).json({ msg: "Invalid country" });
    }
    const currency = Object.keys(countryData.currencies)[0];
    

    // 🏢 Create Company
    const company = await Company.create({
      name: companyName,
      country,
      currency,
    });

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👑 Create Admin
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      company_id: company.id,
      status: "ACTIVE", 
    });

    res.json({ message: "Signup successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❗ Check if user activated
    if (user.status !== "ACTIVE") {
      return res.status(403).json({ msg: "Please set your password first" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🎟️ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        company_id: user.company_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // 🔍 Find user by token
    const user = await User.findOne({
      where: { invite_token: token },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Update user
    user.password = hashedPassword;
    user.status = "ACTIVE";
    user.invite_token = null;

    await user.save();

    res.json({ message: "Password set successfully. You can now login." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};