import { NextRequest } from "next/server";
import { syncDB, Product, Category, Review, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Op } from "sequelize";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  const { id } = await params;
  const isNumeric = !isNaN(Number(id));
  const product = await Product.findOne({
    where: { 
      [isNumeric ? "id" : "slug"]: id,
      isActive: true 
    },
    include: [
      { model: Category, as: "category", attributes: ["id", "name", "slug"] },
      {
        model: Review, as: "reviews",
        include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }],
        limit: 10,
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!product) return apiError("Product not found", 404);

  // Related products
  const related = await Product.findAll({
    where: {
      categoryId: product.categoryId,
      id: { [Op.ne]: product.id },
      isActive: true,
    },
    limit: 4,
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
  });

  return apiResponse({ product, related });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return apiError("Unauthorized", 401);

  const product = await Product.findByPk(id);
  if (!product) return apiError("Product not found", 404);

  const body = await req.json();
  await product.update(body);
  return apiResponse(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return apiError("Unauthorized", 401);

  const product = await Product.findByPk(id);
  if (!product) return apiError("Product not found", 404);

  await product.update({ isActive: false }); // soft delete
  return apiResponse({ message: "Product deleted" });
}
