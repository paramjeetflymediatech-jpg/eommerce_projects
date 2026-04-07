import nodemailer from "nodemailer";

const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const emailHost = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
const emailPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587;
const emailFrom = process.env.EMAIL_FROM || `Aion Luxury <${emailUser}>`;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: false, // true for 465, false for 587
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

/**
 * Base Layout Template
 */
function baseEmailLayout(content: string, previewText: string = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Aion Luxury</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse !important; }
    a { color: #111111; text-decoration: underline; font-weight: 500; }
    
    .wrapper { width: 100%; table-layout: fixed; background-color: #f9fafb; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #eeeeee; }
    .header { padding: 48px 40px 32px; text-align: center; }
    .content { padding: 0 40px 48px; color: #374151; line-height: 1.6; font-size: 16px; }
    .footer { padding: 40px; text-align: center; color: #9ca3af; font-size: 13px; letter-spacing: 0.02em; }
    
    .logo { height: 32px; width: auto; margin-bottom: 24px; }
    .logo-text { font-size: 18px; font-weight: 800; letter-spacing: 0.2em; color: #000000; text-transform: uppercase; margin: 0; }
    
    h1 { color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; line-height: 1.25; }
    p { margin: 0 0 24px; }
    
    .btn { display: inline-block; padding: 14px 28px; background-color: #000000; color: #ffffff !important; border-radius: 6px; text-decoration: none !important; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.25s ease; }
    
    .otp-display { background-color: #f3f4f6; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0; border: 1px dashed #d1d5db; }
    .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #000000; margin: 0; padding-left: 12px; }
    .otp-expiry { font-size: 13px; color: #6b7280; margin-top: 12px; font-weight: 400; }
    
    @media only screen and (max-width: 620px) {
      .main { border-radius: 0 !important; border: 0 !important; }
      .header, .content, .footer { padding-left: 24px !important; padding-right: 24px !important; }
      .content { font-size: 15px !important; }
      .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
    }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>
  <div class="wrapper">
    <table class="main" role="presentation">
      <tr>
        <td class="header">
          <p class="logo-text">AION LUXURY</p>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>© ${new Date().getFullYear()} Aion Luxury. All rights reserved.</p>
          <p style="margin-top: 8px;">Premium E-commerce Excellence</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
}

/**
 * OTP Email Template
 */
function otpEmailTemplate(otp: string, title: string, message: string) {
  const content = `
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="otp-display">
      <div class="otp-code">${otp}</div>
      <p class="otp-expiry">This code will expire in 10 minutes</p>
    </div>
    <p>If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.</p>
  `;
  return baseEmailLayout(content, `Your verification code is ${otp}`);
}

/**
 * Welcome Email Template
 */
function welcomeEmailTemplate(name: string) {
  const content = `
    <h1>Welcome to Aion Luxury, ${name}!</h1>
    <p>We're thrilled to have you join our community of discerning shoppers. Aion Luxury is designed to provide you with the finest selection of premium products and a seamless shopping experience.</p>
    <p>Get started by exploring our featured collections and finding something special today.</p>
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="btn">Explore Collections</a>
    </div>
    <p>If you have any questions, our support team is always here to help.</p>
  `;
  return baseEmailLayout(content, "Welcome to Aion Luxury! We're thrilled to have you.");
}

/**
 * Order Confirmation Template
 */
function orderConfirmationTemplate(order: any) {
  const content = `
    <h1>Order Confirmed</h1>
    <p>Thank you for your order, <strong>${order.customerName}</strong>. We're getting it ready and will notify you as soon as it ships.</p>
    
    <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin: 32px 0; border: 1px solid #e5e7eb;">
      <p style="margin-bottom: 12px; font-weight: 600; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</p>
      <div style="font-size: 15px; color: #4b5563;">
        <p style="margin: 0;">Order Number: <strong>${order.orderNumber}</strong></p>
        <p style="margin: 4px 0 0;">Total Amount: <strong>${order.total}</strong></p>
      </div>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders" class="btn">Track Your Order</a>
    </div>
  `;
  return baseEmailLayout(content, `Order confirmation #${order.orderNumber}`);
}

/**
 * Order Status Update Template
 */
function orderStatusUpdateTemplate(order: any) {
  const statusColors: any = {
    PROCESSING: "#007AFF",
    SHIPPED: "#AF52DE",
    DELIVERED: "#34C759",
    CANCELLED: "#FF3B30",
  };
  const color = statusColors[order.status] || "#000000";

  const content = `
    <h1>Order Update</h1>
    <p>Hello <strong>${order.customerName}</strong>, the status of your order <strong>#${order.orderNumber}</strong> has been updated to:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <span style="display: inline-block; padding: 8px 24px; background-color: ${color}10; color: ${color}; border: 1px solid ${color}; border-radius: 100px; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">
        ${order.status}
      </span>
      <h2 style="font-size: 20px; font-weight: 700; margin: 0;">MRP: ₹${order.total.toLocaleString()}</h2>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders/${order.orderId}/invoice" class="btn">View Full Invoice</a>
    </div>

    ${order.trackingId ? `
    <div style="background-color: #f9fafb; border-radius: 12px; padding: 32px; border: 1px solid #eeeeee; margin: 32px 0;">
      <p style="margin: 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; font-weight: 700;">Tracking Information</p>
      <p style="margin: 16px 0 8px; font-size: 18px; color: #111827; font-weight: 600;">${order.carrier || 'Standard Shipping'}</p>
      <p style="margin: 0; font-family: monospace; font-size: 16px; color: #000000; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${order.trackingId}</p>
    </div>
    ` : ''}

    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/track?id=${order.orderId}" class="btn">View Order Progress</a>
    </div>

    <p>If you have any questions, please don't hesitate to reach out to our team.</p>
  `;
  return baseEmailLayout(content, `Update for your order #${order.orderNumber}: ${order.status}`);
}

/**
 * Email Sender Functions
 */

export async function sendOTPEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Verify your Aion Luxury account",
    html: otpEmailTemplate(
      otp,
      "Verify your identity",
      "Welcome to Aion Luxury! Use the verification code below to activate your account."
    ),
  });
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Reset your Aion Luxury password",
    html: otpEmailTemplate(
      otp,
      "Reset your password",
      "You requested a password reset. Use the verification code below to proceed. This code is valid for 10 minutes."
    ),
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: "Welcome to Aion Luxury",
    html: welcomeEmailTemplate(name),
  });
}

export async function sendOrderConfirmationEmail(email: string, order: any) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: `Order Confirmation #${order.orderNumber}`,
    html: orderConfirmationTemplate(order),
  });
}

export async function sendOrderStatusUpdateEmail(email: string, order: any) {
  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: `Order Update #${order.orderNumber}: ${order.status}`,
    html: orderStatusUpdateTemplate(order),
  });
}

/**
 * Helpers
 */

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
}
