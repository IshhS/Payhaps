const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// Set password (invite flow)
router.post("/set-password", authController.setPassword);

module.exports = router;