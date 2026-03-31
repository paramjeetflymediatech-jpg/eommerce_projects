import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function otpEmailTemplate(otp: string, title: string, message: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
      .wrapper { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
      .header { background: #111111; padding: 32px 40px; text-align: center; }
      .header h1 { color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 2px; }
      .body { padding: 40px; }
      .body h2 { color: #111111; font-size: 20px; margin: 0 0 16px; }
      .body p { color: #555555; font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
      .otp-box { background: #f8f8f8; border: 2px dashed #111111; border-radius: 8px; text-align: center; padding: 24px; margin: 24px 0; }
      .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #111111; }
      .expiry { color: #888888; font-size: 13px; margin-top: 8px; }
      .footer { background: #f8f8f8; padding: 20px 40px; text-align: center; color: #aaaaaa; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header"><h1>SHOPNEST</h1></div>
      <div class="body">
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="expiry">This code expires in 10 minutes</div>
        </div>
        <p>If you did not request this, please ignore this email.</p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} ShopNest. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
}

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM || "ShopNest"} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your ShopNest account",
    html: otpEmailTemplate(
      otp,
      "Email Verification",
      "Welcome to ShopNest! Use the code below to verify your email address and activate your account."
    ),
  });
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM || "ShopNest"} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your ShopNest password",
    html: otpEmailTemplate(
      otp,
      "Password Reset",
      "You requested to reset your password. Use the verification code below to proceed. This code is valid for 10 minutes."
    ),
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}
