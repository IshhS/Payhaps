const { User, Company } = require("../models");
const crypto = require("crypto");
const { sendInviteEmail } = require("../services/email.service");

/**
 * POST /api/users/invite
 * Admin-only: create a new user and send them an invite email.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, manager_id } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Only admin can create users" });
    }

    if (!name || !email || !role) {
      return res.status(400).json({ msg: "Name, email, and role are required" });
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
      manager_id: manager_id || null,
      company_id: req.user.company_id,
      invite_token: token,
      status: "PENDING",
      password: null,
    });

    // 📧 Send invite email (don't let email failure block user creation)
    try {
      await sendInviteEmail(email, token);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
      return res.json({
        message: `User "${name}" created, but invite email failed to send. Share this link manually.`,
        user,
        inviteLink: `${process.env.FRONTEND_URL}/set-password?token=${token}`,
      });
    }

    res.json({
      message: `User "${name}" invited successfully. Email sent to ${email}.`,
      user,
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/users
 * Returns all users in the same company as the authenticated user.
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { company_id: req.user.company_id },
      attributes: ["id", "name", "email", "role", "status", "manager_id", "createdAt"],
      include: [{ model: Company, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/users/:id
 * Admin-only: update a user's role or manager mapping.
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, manager_id } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Only admin can update users" });
    }

    const userToUpdate = await User.findOne({ where: { id, company_id: req.user.company_id } });
    if (!userToUpdate) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (role) userToUpdate.role = role;
    if (manager_id !== undefined) userToUpdate.manager_id = manager_id; // allow null

    await userToUpdate.save();

    res.json({ message: "User updated successfully", user: userToUpdate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
