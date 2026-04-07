import path from "path";
import fs from "fs";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true, mode: 0o755 });
}
try {
  fs.chmodSync(UPLOAD_DIR, 0o755);
} catch (e) {
  console.error(`[UPLOAD] Failed to set permissions for ${UPLOAD_DIR}:`, e);
}

["products", "categories", "avatars", "reviews"].forEach((dir) => {
  const fullPath = path.join(UPLOAD_DIR, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true, mode: 0o755 });
  }
  try {
    fs.chmodSync(fullPath, 0o755);
  } catch (e) {
    console.error(`[UPLOAD] Failed to set permissions for ${fullPath}:`, e);
  }
});

export const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "video/mp4", "video/webm", "video/quicktime", "video/ogg"
];
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function getPublicPath(fullPath: string): string {
  // Convert absolute path to public URL path
  return "/uploads/" + path.relative(UPLOAD_DIR, fullPath).replace(/\\/g, "/");
}

export async function saveFile(
  file: File,
  folder: "products" | "categories" | "avatars" | "reviews"
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only standard images and videos are allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 50MB.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const destPath = path.join(UPLOAD_DIR, folder, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  
  // Set permissions to be publicly readable but only writable by the server process (owner)
  try {
    fs.chmodSync(destPath, 0o644);
  } catch (e) {
    console.error(`[UPLOAD] Failed to set permissions for ${destPath}:`, e);
  }

  console.log(`[UPLOAD] File saved to: ${destPath}`);
  console.log(`[UPLOAD] Public URL: /api/uploads/${folder}/${filename}`);

  return `/api/uploads/${folder}/${filename}`;
}

export function deleteFile(publicPath: string): void {
  try {
    // Strip /api prefix if present (new URL format is /api/uploads/...)
    const relativePath = publicPath.replace(/^\/api/, "");
    const fullPath = path.join(process.cwd(), "public", relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (e) {
    console.error("Failed to delete file:", e);
  }
}
