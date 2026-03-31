import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Address } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

// GET /api/addresses — list all addresses for the logged-in user
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return apiError("Unauthorized", 401);

  const userId = Number((session as any).user.id);
  const addresses = await Address.findAll({
    where: { userId },
    order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
  });

  return apiResponse({ addresses });
}

// POST /api/addresses — create a new address
export async function POST(req: NextRequest) {
  await ensureDB();
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return apiError("Unauthorized", 401);

  const userId = Number((session as any).user.id);
  const body = await req.json();
  const { name, street, city, state, zip, country, phone, isDefault } = body;

  if (!name || !street || !city || !state || !zip || !country || !phone) {
    return apiError("All fields are required");
  }

  // If setting as default, unset other defaults
  if (isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  // If this is the first address, make it default automatically
  const count = await Address.count({ where: { userId } });
  const shouldBeDefault = isDefault || count === 0;

  const address = await Address.create({
    userId,
    name,
    street,
    city,
    state,
    zip: String(zip),
    country: country || "IN",
    phone: String(phone),
    isDefault: shouldBeDefault,
  });

  return apiResponse({ address }, 201);
}

// PATCH /api/addresses — update or set default
export async function PATCH(req: NextRequest) {
  await ensureDB();
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return apiError("Unauthorized", 401);

  const userId = Number((session as any).user.id);
  const body = await req.json();
  const { id, isDefault, ...rest } = body;

  if (!id) return apiError("Address ID required");

  const address = await Address.findOne({ where: { id, userId } });
  if (!address) return apiError("Address not found", 404);

  if (isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  await address.update({ ...rest, ...(isDefault !== undefined ? { isDefault } : {}) });

  return apiResponse({ address });
}

// DELETE /api/addresses — delete an address
export async function DELETE(req: NextRequest) {
  await ensureDB();
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return apiError("Unauthorized", 401);

  const userId = Number((session as any).user.id);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return apiError("Address ID required");

  const address = await Address.findOne({ where: { id: Number(id), userId } });
  if (!address) return apiError("Address not found", 404);

  await address.destroy();
  return apiResponse({ message: "Address deleted" });
}
