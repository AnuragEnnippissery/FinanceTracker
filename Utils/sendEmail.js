import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Make sure env is loaded BEFORE creating transporter
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  }
});

// The function you will import everywhere
export async function sendEmailByEmail(to, subject, text, html) {
  try {
    const mailOptions = {
      from: `Finance Tracker <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
}
