import { NextRequest } from "next/server";
import { Product, Category, ProductVariant, ensureDB } from "@/lib/models";
import { apiResponse, apiError, slugify, getPaginationMeta } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Op } from "sequelize";


export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt_desc";
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const where: any = { isActive: true };
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (category) {
      // Recursive category filtering: include all child categories
      const allSubcategories = await Category.findAll({
        attributes: ["id"],
        where: { [Op.or]: [{ id: category }, { parentId: category }] },
        raw: true
      });
      // For deeper nesting, we'd need a recursive CTE or multiple lookups, 
      // but for "3 levels" as requested, we handle parents and immediate children here.
      // Let's implement a more robust version:
      const categoryIds = [parseInt(category)];
      
      const getChildIds = async (pId: number) => {
        const children = await Category.findAll({ where: { parentId: pId }, attributes: ["id"], raw: true });
        for (const child of children) {
          categoryIds.push(child.id);
          await getChildIds(child.id); // Recurse
        }
      };

      await getChildIds(parseInt(category));
      where.categoryId = { [Op.in]: categoryIds };
    }
    if (featured === "true") where.isFeatured = true;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name", "slug"] },
        { model: ProductVariant, as: "variants", attributes: ["id", "color", "images", "price", "comparePrice", "stock"] }
      ],
      order: sort === "price_asc" ? [["price", "ASC"]] : sort === "price_desc" ? [["price", "DESC"]] : [["createdAt", "DESC"]],
      distinct: true, // Required when using includes with findAndCountAll
    });

    // Expand variants into individual listing items
    const expandedItems: any[] = [];
    rows.forEach((product: any) => {
      const p = product.toJSON();
      
      if (p.variants && p.variants.length > 0) {
        // Group variants by color to show each color once
        const colorGroups: Record<string, any> = {};
        
        p.variants.forEach((v: any) => {
          const colorKey = v.color || "default";
          if (!colorGroups[colorKey]) {
            colorGroups[colorKey] = v;
          }
        });

        Object.values(colorGroups).forEach((variant: any) => {
          expandedItems.push({
            ...p,
            id: `p${p.id}-v${variant.id}`, // composite ID
            originalId: p.id,
            variantId: variant.id,
            name: variant.color ? `${p.name} — ${variant.color}` : p.name,
            color: variant.color,
            price: variant.price || p.price,
            comparePrice: variant.comparePrice || p.comparePrice,
            stock: variant.stock,
            images: variant.images && variant.images.length > 0 ? variant.images : p.images,
            isVariant: true
          });
        });
      } else {
        // No variants, just show the base product
        expandedItems.push({
          ...p,
          isVariant: false
        });
      }
    });

    // Handle pagination on the expanded items
    const totalExpanded = expandedItems.length;
    const paginatedItems = expandedItems.slice(offset, offset + limit);

    return apiResponse({ 
      products: paginatedItems, 
      pagination: getPaginationMeta(totalExpanded, page, limit) 
    });

  } catch (err: any) {
    console.error("Products GET error:", err);
    return apiError("Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return apiError("Unauthorized", 401);

  const body = await req.json();
  const { name, description, shortDescription, price, comparePrice, stock, categoryId, tags, isFeatured, images } = body;

  if (!name || !description || !price || !categoryId) {
    return apiError("Missing required fields: name, description, price, categoryId");
  }

  const slug = slugify(name) + "-" + Date.now();
  const product = await Product.create({
    name, slug, description, shortDescription, price: parseFloat(price),
    comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
    stock: parseInt(stock) || 0,
    categoryId: parseInt(categoryId),
    tags: tags || [],
    isFeatured: isFeatured || false,
    images: images || [],
  });

  return apiResponse(product, 201);
}
