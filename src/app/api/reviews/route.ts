import { NextRequest } from "next/server";
import { syncDB, Review, User, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  if (!productId) return apiError("productId is required");

  const { count, rows } = await Review.findAndCountAll({
    where: { productId },
    include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return apiResponse({ reviews: rows, total: count });
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { productId, rating, title, comment } = body;

  if (!productId || !rating || !comment) return apiError("productId, rating, and comment are required");
  if (rating < 1 || rating > 5) return apiError("Rating must be between 1 and 5");

  const existing = await Review.findOne({
    where: { userId: session.user.id, productId },
  });
  if (existing) return apiError("You have already reviewed this product");

  const review = await Review.create({
    userId: parseInt(session.user.id),
    productId,
    rating,
    title,
    comment,
  });

  // Update product rating
  const allReviews = await Review.findAll({ where: { productId }, attributes: ["rating"], raw: true });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Product.update({ rating: avgRating, reviewCount: allReviews.length }, { where: { id: productId } });

  return apiResponse(review, 201);
}
