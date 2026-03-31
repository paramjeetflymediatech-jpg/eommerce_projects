import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, User } from "@/lib/models";
import { apiResponse, apiError, getPaginationMeta } from "@/lib/utils";
import { Op } from "sequelize";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/users — list all users (admin only)
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const offset = (page - 1) * limit;
  const search = searchParams.get("search") || "";

  const where: any = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  // Exclude current logged-in admin
  if ((session as any).user?.email) {
    where.email = { [Op.ne]: (session as any).user.email };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    limit,
    offset,
    attributes: { exclude: ["passwordHash", "otp", "otpExpiry", "token"] },
    order: [["createdAt", "DESC"]],
  });

  return apiResponse({
    users: rows,
    pagination: getPaginationMeta(count, page, limit),
  });
}

// PATCH /api/admin/users — update user (role or verification status)
export async function PATCH(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id, name, role, isVerified } = await req.json();
    if (!id) return apiError("User ID is required");

    const user = await User.findByPk(id);
    if (!user) return apiError("User not found", 404);

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isVerified === "boolean") user.isVerified = isVerified;

    await user.save();
    return apiResponse({ user });
  } catch (error) {
    return apiError("Failed to update user");
  }
}

// DELETE /api/admin/users — delete user
export async function DELETE(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return apiError("User ID is required");

  const user = await User.findByPk(id);
  if (!user) return apiError("User not found", 404);

  // Prevent admin from deleting themselves
  if (user.email === (session as any).user?.email) {
    return apiError("You cannot delete your own admin account", 400);
  }

  await user.destroy();
  return apiResponse({ message: "User deleted successfully" });
}
