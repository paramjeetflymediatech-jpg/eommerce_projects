import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { sendOTPEmail, generateOTP, getOTPExpiry } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Basic presence validation
    if (!name || !email || !password)
      return apiError("Name, email, and password are required");

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return apiError("Please enter a valid email address");

    // 3. Admin email block (dynamic via env for future-proofing)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@aionluxury.com";
    if (email.toLowerCase() === adminEmail.toLowerCase())
      return apiError("This email is reserved for administrative use.");

    // 4. Password complexity validation (min 8 chars, letter + number)
    if (password.length < 8)
      return apiError("Password must be at least 8 characters long");
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password))
      return apiError("Password must contain at least one letter and one number");

    // 5. Check if user already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return apiError("An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    const user = await User.create({
      name,
      email,
      passwordHash,
      otp,
      otpExpiry,
      isVerified: false,
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
    }

    return apiResponse(
      {
        message: "Registration successful. Please check your email for the OTP verification code.",
        userId: user.id,
        email: user.email,
      },
      201
    );
  } catch (error: any) {
    console.error("Registration API error:", error);
    return apiError(error.message || "An unexpected error occurred", 500);
  }
}
