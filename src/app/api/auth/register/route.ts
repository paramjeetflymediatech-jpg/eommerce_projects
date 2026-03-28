import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { syncDB, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) return apiError("name, email, and password are required");
  if (password.length < 6) return apiError("Password must be at least 6 characters");

  const existing = await User.findOne({ where: { email } });
  if (existing) return apiError("Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });

  return apiResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, 201);
}
