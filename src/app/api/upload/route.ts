import { NextRequest } from "next/server";
import { saveFile } from "@/lib/upload";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const formData = await req.formData();
  const folder = (formData.get("folder") as "products" | "categories" | "avatars" | "reviews") || "products";
  
  // Only admins can upload to products and categories
  if (session.user.role !== "ADMIN" && (folder === "products" || folder === "categories")) {
    return apiError("Unauthorized", 401);
  }

  const files = formData.getAll("files") as File[];

  if (!files.length) return apiError("No files provided");

  const urls: string[] = [];
  for (const file of files) {
    try {
      const url = await saveFile(file, folder);
      urls.push(url);
    } catch (e: unknown) {
      return apiError((e as Error).message);
    }
  }

  return apiResponse({ urls });
}
