import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: use Ethereal test account for development
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendEmail({ to, subject, text, html, from }) {
  const transporter = await createTransporter();
  const fromAddr = from || process.env.FROM_EMAIL || "no-reply@example.com";

  const info = await transporter.sendMail({
    from: fromAddr,
    to,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  return { info, previewUrl };
}

export default sendEmail;
