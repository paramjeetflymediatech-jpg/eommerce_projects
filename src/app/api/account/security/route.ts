import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return apiError("Both current and new passwords are required", 400);
    }

    if (newPassword.length < 8) {
      return apiError("New password must be at least 8 characters long", 400);
    }

    const user = await User.findByPk(session.user.id);
    if (!user || !user.passwordHash) return apiError("User not found", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return apiError("Current password is incorrect", 400);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash: newPasswordHash });

    return apiResponse({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("SECURITY_UPDATE_ERROR:", error);
    return apiError(error.message || "Something went wrong", 500);
  }
}
