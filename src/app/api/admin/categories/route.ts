import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Category, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import slugify from "slugify";
import { Op } from "sequelize";
import { revalidatePath } from "next/cache";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/categories — list all categories (flat or nested)
import { getPaginationMeta } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const session = await requireAdmin(req);
    if (!session) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const getAll = searchParams.get("all") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Category.findAndCountAll({
      where,
      include: [{ model: Category, as: "children" }],
      limit: getAll ? undefined : limit,
      offset: getAll ? undefined : offset,
      order: [["id", "ASC"]],
    });

    return apiResponse({ 
      categories: rows, 
      pagination: getAll ? getPaginationMeta(count, 1, count || 1) : getPaginationMeta(count, page, limit) 
    });
  } catch (error: any) {
    console.error("Admin categories GET error:", error);
    return apiError("Failed to fetch categories");
  }
}

// POST /api/admin/categories — create category
export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { name, description, parentId, image, banner } = await req.json();
    if (!name) return apiError("Name is required");

    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if slug exists
    const existing = await Category.findOne({ where: { slug } });
    if (existing) return apiError("Category with this name/slug already exists");

    const category = await Category.create({
      name,
      slug,
      description,
      parentId: parentId || null,
      image,
      banner
    });

    revalidatePath("/", "layout");
    return apiResponse({ category }, 201);
  } catch (error) {
    console.error("Create category error:", error);
    return apiError("Failed to create category");
  }
}

// PATCH /api/admin/categories — update category
export async function PATCH(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id, name, description, parentId, image, banner } = await req.json();
    if (!id) return apiError("Category ID is required");

    const category = await Category.findByPk(id);
    if (!category) return apiError("Category not found", 404);

    // Prevent making a subcategory its own parent or a circular reference
    if (parentId && parseInt(parentId) === id) {
      return apiError("A category cannot be its own parent");
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) category.description = description;
    if (parentId !== undefined) category.parentId = parentId || null;
    if (image !== undefined) category.image = image;
    if (banner !== undefined) category.banner = banner;

    await category.save();
    revalidatePath("/", "layout");
    return apiResponse({ category });
  } catch (error) {
    console.error("Update category error:", error);
    return apiError("Failed to update category");
  }
}

// DELETE /api/admin/categories — delete category
export async function DELETE(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return apiError("Category ID is required");

  try {
    const category = await Category.findByPk(id);
    if (!category) return apiError("Category not found", 404);

    // Check if it has subcategories
    const childrenCount = await Category.count({ where: { parentId: id } });
    if (childrenCount > 0) {
      return apiError("Cannot delete category with subcategories. Delete children first.");
    }

    // Check if it has associated products
    const productsCount = await Product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return apiError(`Cannot delete category because it is linked to ${productsCount} product(s). Please remove or reassign these products first.`);
    }

    await category.destroy();
    revalidatePath("/", "layout");
    return apiResponse({ message: "Category deleted successfully" });
  } catch (error) {
    return apiError("Failed to delete category. It might be linked to products.");
  }
}
