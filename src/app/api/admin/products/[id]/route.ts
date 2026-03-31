import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Product, Category } from "@/lib/models";
import { apiResponse, apiError, slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") return null;
  return session;
}

// GET /api/admin/products/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  if (!await requireAdmin()) return apiError("Unauthorized", 401);
  const { id } = await params;
  const product = await Product.findByPk(id, {
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
  });
  if (!product) return apiError("Product not found", 404);
  return apiResponse({ product });
}

// PUT /api/admin/products/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  if (!await requireAdmin()) return apiError("Unauthorized", 401);
  const { id } = await params;

  const product = await Product.findByPk(id);
  if (!product) return apiError("Product not found", 404);

  const body = await req.json();
  const { name, description, price, comparePrice, stock, categoryId, images, isFeatured, slug } = body;

  const finalSlug = slug ? slugify(slug) : undefined;

  await product.update({
    ...(name && { name }),
    ...(finalSlug && { slug: finalSlug }),
    ...(description !== undefined && { description }),
    ...(price && { price: parseFloat(price) }),
    ...(comparePrice !== undefined && { comparePrice: comparePrice ? parseFloat(comparePrice) : null }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(images && { images }),
    ...(isFeatured !== undefined && { isFeatured }),
  });

  return apiResponse({ product });
}

// DELETE /api/admin/products/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureDB();
  if (!await requireAdmin()) return apiError("Unauthorized", 401);
  const { id } = await params;

  const product = await Product.findByPk(id);
  if (!product) return apiError("Product not found", 404);

  await product.destroy();
  return apiResponse({ message: "Product deleted successfully" });
}
