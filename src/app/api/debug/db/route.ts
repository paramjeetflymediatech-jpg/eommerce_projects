import { NextRequest } from "next/server";
import { Product, Category, User, ensureDB } from "@/lib/models";
import { apiResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    
    const [products, users, categories] = await Promise.all([
      Product.findAll({ include: [{ model: Category, as: "category" }] }),
      User.findAll({ attributes: ["email", "role"] }),
      Category.findAll({ 
        where: { parentId: null },
        include: [{ model: Category, as: "children" }] 
      })
    ]);
    
    return apiResponse({ 
      counts: {
        products: products.length,
        users: users.length,
        categories: categories.length
      },
      users,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        categoryName: (p as any).category?.name
      })),
      categories
    });
  } catch (err: any) {
    return apiResponse({ error: err.message }, 500);
  }
}
