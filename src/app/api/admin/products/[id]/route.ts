import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Product, Category, ProductVariant, sequelize } from "@/lib/models";
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
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: ProductVariant, as: "variants" }
    ],
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
  const { name, description, price, comparePrice, stock, categoryId, images, isFeatured, slug, variants } = body;

  const finalSlug = slug ? slugify(slug) : undefined;

  const transaction = await sequelize.transaction();

  try {
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
    }, { transaction });

    if (variants && Array.isArray(variants)) {
      // Very simple variant sync: delete old, add new
      // In a real app, you might want to match by ID to preserve them
      await ProductVariant.destroy({ where: { productId: product.id }, transaction });
      for (const v of variants) {
        await ProductVariant.create({
          productId: product.id,
          size: v.size,
          color: v.color || null,
          price: v.price ? parseFloat(v.price) : null,
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
          stock: parseInt(v.stock) || 0,
          sku: v.sku || null,
        }, { transaction });
      }
    }

    await transaction.commit();
    return apiResponse({ product });
  } catch (error) {
    await transaction.rollback();
    console.error("Product update error:", error);
    return apiError("Failed to update product and variants");
  }
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
