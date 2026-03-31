import { NextRequest } from "next/server";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { sendPasswordResetEmail, generateOTP, getOTPExpiry } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  await ensureDB();
  const body = await req.json();
  const { email } = body;

  if (!email) return apiError("Email address is required");

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return apiError("Please enter a valid email address");

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return apiError("No account found with this email address. Please check and try again.", 404);
  }

  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  await user.update({ otp, otpExpiry });

  try {
    await sendPasswordResetEmail(email, otp);
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return apiError("Failed to send the reset code. Please try again later.", 500);
  }

  return apiResponse({
    message: "A password reset code has been sent to your email. Please check your inbox.",
  });
}
