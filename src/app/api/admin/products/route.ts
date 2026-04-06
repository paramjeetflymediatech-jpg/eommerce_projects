import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Product, Category, ProductVariant, sequelize } from "@/lib/models";
import { apiResponse, apiError, getPaginationMeta, slugify } from "@/lib/utils";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/products — list all products (admin only)
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    limit,
    offset,
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      { model: ProductVariant, as: "variants" }
    ],
    order: [["createdAt", "DESC"]],
  });

  return apiResponse({
    products: rows,
    pagination: getPaginationMeta(count, page, limit),
  });
}

// POST /api/admin/products — create product (admin only)
export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { name, description, price, comparePrice, stock, categoryId, images, isFeatured, slug, variants } = body;

  if (!name || !price || !categoryId) {
    return apiError("name, price, and categoryId are required");
  }

  const generatedSlug = slugify(slug || name);

  const existing = await Product.findOne({ where: { slug: generatedSlug } });
  if (existing) return apiError("A product with this slug already exists");

  const transaction = await sequelize.transaction();

  try {
    const product = await Product.create({
      name,
      slug: generatedSlug,
      description: description || "",
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      stock: parseInt(stock) || 0,
      categoryId: parseInt(categoryId),
      images: images || [],
      isFeatured: isFeatured || false,
      rating: 0,
      reviewCount: 0,
    }, { transaction });

    if (variants && Array.isArray(variants)) {
      // Pre-check for globally conflicting SKUs before inserting
      const incomingSKUs = variants.map((v: any) => v.sku?.trim()).filter(Boolean) as string[];
      let takenSKUs = new Set<string>();
      if (incomingSKUs.length > 0) {
        const { Op } = await import("sequelize");
        const conflicting = await ProductVariant.findAll({
          where: { sku: { [Op.in]: incomingSKUs } },
          attributes: ["sku"],
          raw: true,
        });
        takenSKUs = new Set(conflicting.map((r: any) => r.sku));
      }

      for (const v of variants) {
        const skuValue = v.sku?.trim();
        const safeSKU = skuValue && !takenSKUs.has(skuValue) ? skuValue : null;

        await ProductVariant.create({
          productId: product.id,
          size: v.size,
          color: v.color || null,
          price: v.price ? parseFloat(v.price) : null,
          comparePrice: v.comparePrice ? parseFloat(v.comparePrice) : null,
          stock: parseInt(v.stock) || 0,
          sku: safeSKU,
          images: Array.isArray(v.images) ? v.images.filter((img: string) => img?.trim()) : [],
        }, { transaction });
      }
    }

    await transaction.commit();
    return apiResponse({ product }, 201);
  } catch (error) {
    await transaction.rollback();
    console.error("Product creation error:", error);
    return apiError("Failed to create product and variants");
  }
}
