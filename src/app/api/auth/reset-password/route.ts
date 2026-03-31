import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  await ensureDB();
  const body = await req.json();
  const { email, otp, newPassword } = body;

  if (!email || !otp || !newPassword)
    return apiError("Email, OTP, and new password are required");

  if (newPassword.length < 6)
    return apiError("New password must be at least 6 characters");

  const user = await User.findOne({ where: { email } });
  if (!user)
    return apiError("Invalid request", 400);

  if (!user.otp || !user.otpExpiry)
    return apiError("No password reset request found. Please request a new OTP.");

  if (new Date() > new Date(user.otpExpiry))
    return apiError("OTP has expired. Please request a new password reset.", 410);

  if (user.otp !== otp)
    return apiError("Invalid OTP. Please check and try again.", 401);

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await user.update({
    passwordHash,
    otp: null,
    otpExpiry: null,
    isVerified: true, // Also verify account if not already verified
  });

  return apiResponse({
    message: "Password reset successful. You can now log in with your new password.",
  });
}
