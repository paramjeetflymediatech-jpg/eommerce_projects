import { NextRequest } from "next/server";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { sendOTPEmail, generateOTP, getOTPExpiry } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  await ensureDB();
  const body = await req.json();
  const { email } = body;

  if (!email)
    return apiError("Email is required");

  const user = await User.findOne({ where: { email } });
  if (!user)
    return apiError("User not found", 404);

  if (user.isVerified)
    return apiError("Email is already verified");

  // Rate limit: check if last OTP was sent less than 60 seconds ago
  if (user.otpExpiry) {
    const lastSentAt = new Date(user.otpExpiry).getTime() - 10 * 60 * 1000;
    const secondsSinceLastSend = (Date.now() - lastSentAt) / 1000;
    if (secondsSinceLastSend < 60) {
      return apiError(
        `Please wait ${Math.ceil(60 - secondsSinceLastSend)} seconds before requesting a new OTP.`,
        429
      );
    }
  }

  const otp = generateOTP();
  const otpExpiry = getOTPExpiry();

  await user.update({ otp, otpExpiry });

  try {
    await sendOTPEmail(email, otp);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return apiError("Failed to send OTP email. Please try again.", 500);
  }

  return apiResponse({
    message: "A new OTP has been sent to your email.",
  });
}
