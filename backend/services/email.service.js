// services/email.service.js
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Create transporter lazily to ensure env vars are loaded
let _transporter = null;

async function getTransporter() {
  if (!_transporter) {
    const isMock = !process.env.EMAIL || process.env.EMAIL.includes("***");
    if (isMock) {
      // Use Ethereal for testing when real credentials are not provided
      const testAccount = await nodemailer.createTestAccount();
      _transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log("Using Ethereal Mail for testing.");
    } else {
      _transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }
  return _transporter;
}

exports.sendInviteEmail = async (email, token) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${frontendUrl}/set-password?token=${token}`;

  const transporter = await getTransporter();
  const isMock = !process.env.EMAIL || process.env.EMAIL.includes("***");

  const info = await transporter.sendMail({
    from: isMock ? '"Payhaps Local" <noreply@payhaps.local>' : process.env.EMAIL,
    to: email,
    subject: "You're invited to Payhaps!",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to Payhaps! 🎉</h2>
        <p style="color: #475569;">You've been invited to join the reimbursement management system.</p>
        <p style="color: #475569;">Click the button below to set your password and activate your account:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${link}" style="display: inline-block; background: #10b981; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Set Your Password
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 0.85rem;">Or copy this link: <a href="${link}">${link}</a></p>
      </div>
    `,
  });

  if (isMock) {
    console.log("==================================================");
    console.log("Ethereal Mail Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("==================================================");
  }
};