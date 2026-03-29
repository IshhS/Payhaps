const { User } = require("../models");
const crypto = require("crypto");
const { sendInviteEmail } = require("../services/email.service");

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, manager_id } = req.body;

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ msg: "Only admin can create users" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists or invited" });
    }

    // 🔐 Generate invite token
    const token = crypto.randomBytes(32).toString("hex");

    // 👤 Create user WITHOUT password
    const user = await User.create({
      name,
      email,
      role,
      manager_id,
      company_id: req.user.company_id,
      invite_token: token,
      status: "PENDING",
      password: null, // important
    });

    // 📧 Send invite email
    await sendInviteEmail(email, token);

    res.json({
      message: "User invited successfully. Email sent.",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
