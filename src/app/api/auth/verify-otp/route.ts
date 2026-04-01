import { NextRequest } from "next/server";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp)
      return apiError("Email and OTP are required");

    const user = await User.findOne({ where: { email } });
    if (!user)
      return apiError("User not found", 404);

    if (user.isVerified)
      return apiError("Email is already verified");

    if (!user.otp || !user.otpExpiry)
      return apiError("No OTP found. Please request a new one.");

    if (new Date() > new Date(user.otpExpiry))
      return apiError("OTP has expired. Please request a new one.", 410);

    if (user.otp !== otp)
      return apiError("Invalid OTP. Please check and try again.", 401);

    // Mark verified and clear OTP
    await user.update({
      isVerified: true,
      otp: null,
      otpExpiry: null,
    });

    return apiResponse({
      message: "Email verified successfully. You can now log in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Verify-OTP API error:", error);
    return apiError(error.message || "An unexpected error occurred", 500);
  }
}
