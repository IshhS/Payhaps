// services/email.service.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendInviteEmail = async (email, token) => {
  const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "You're invited!",
    html: `
      <h3>You are invited to join the company</h3>
      <p>Click below to set your password:</p>
      <a href="${link}">${link}</a>
    `,
  });
};