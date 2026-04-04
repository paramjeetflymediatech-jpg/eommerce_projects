import { NextRequest } from "next/server";
import nodePath from "path";
import fs from "fs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const filePath = nodePath.join(process.cwd(), "public", "uploads", ...segments);

  // Security: prevent directory traversal
  const uploadsDir = nodePath.join(process.cwd(), "public", "uploads");
  if (!filePath.startsWith(uploadsDir)) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = nodePath.extname(filePath).toLowerCase().replace(".", "");

  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
