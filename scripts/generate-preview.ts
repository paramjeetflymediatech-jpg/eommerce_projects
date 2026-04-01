import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// I need to import the functions from mailer.ts, 
// but since it's a TS file and uses env vars, I'll just copy the template logic here for preview.

function baseEmailLayout(content: string, previewText: string = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopNest Preview</title>
  <style>
    body { background-color: #f9fafb; font-family: 'Inter', sans-serif; padding: 40px 0; margin: 0; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #eeeeee; }
    .header { padding: 48px 40px 32px; text-align: center; }
    .content { padding: 0 40px 48px; color: #374151; line-height: 1.6; font-size: 16px; }
    .footer { padding: 40px; text-align: center; color: #9ca3af; font-size: 13px; }
    .logo-text { font-size: 18px; font-weight: 800; letter-spacing: 0.2em; color: #000000; text-transform: uppercase; }
    h1 { color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px; }
    .otp-display { background-color: #f3f4f6; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0; border: 1px dashed #d1d5db; }
    .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #000000; }
    .btn { display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="main">
    <div class="header"><p class="logo-text">SHOPNEST</p></div>
    <div class="content">
      <h1>Verify your identity</h1>
      <p>Welcome to ShopNest! Use the verification code below to activate your account.</p>
      <div class="otp-display">
        <div class="otp-code">123456</div>
        <p style="font-size: 13px; color: #6b7280; margin-top: 12px;">This code will expire in 10 minutes</p>
      </div>
      <p>If you didn't request this code, you can safely ignore this email.</p>
    </div>
    <div class="footer">© 2024 ShopNest. All rights reserved.</div>
  </div>
</body>
</html>`;
}

const html = baseEmailLayout(""); // Content is already inside for preview.
fs.writeFileSync('preview.html', html);
console.log("Preview generated at preview.html");
