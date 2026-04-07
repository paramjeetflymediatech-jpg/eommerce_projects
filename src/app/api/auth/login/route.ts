import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "aionluxury-super-secret-jwt-key-2024");

export async function POST(req: NextRequest) {
  try {
    await ensureDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password)
      return apiError("Email and password are required");

    const user = await User.findOne({ where: { email } });
    if (!user || !user.passwordHash)
      return apiError("Invalid email or password", 401);

    if (!user.isVerified)
      return apiError(
        "Your email is not verified. Please check your inbox for the OTP verification code.",
        403
      );

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return apiError("Invalid email or password", 401);

    // Generate a manual JWT token for persistence or external API use
    const jwt = await new jose.SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    // Update the user record with the latest JWT
    await user.update({ token: jwt });

    return apiResponse({
      message: "Login successful",
      token: jwt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return apiError(error.message || "An unexpected error occurred", 500);
  }
}
