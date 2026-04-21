import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    const { name, avatar } = await req.json();

    const user = await User.findByPk(session.user.id);
    if (!user) return apiError("User not found", 404);

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    await user.update(updateData);

    return apiResponse({ 
      message: "Profile updated successfully",
      user: { name: user.name, avatar: user.avatar } 
    });
  } catch (error: any) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    return apiError(error.message || "Something went wrong", 500);
  }
}
