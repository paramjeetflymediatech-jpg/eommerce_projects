import { Blog, ensureDB } from "@/lib/models";
import BlogListClient from "./BlogListClient";

export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  await ensureDB();

  let blogs: any[] = [];
  try {
    blogs = await Blog.findAll({
      where: { isPublished: true },
      order: [["updatedAt", "DESC"]],
      raw: true,
    });
  } catch (e) {
    console.error("Failed to load blogs on frontend", e);
  }

  return (
    <div style={{ minHeight: "80vh", background: "#fafafa", padding: "clamp(40px, 8vw, 80px) 0" }}>
      <div className="container-app">
        <div style={{ textAlign: "center", marginBottom: "clamp(30px, 6vw, 60px)" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, margin: "0 0 16px", color: "#000" }}>
            The Journal
          </h1>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto", fontSize: "clamp(1rem, 3vw, 1.15rem)" }}>
            Insights, stories, and the latest news from the world of Aion Luxury.
          </p>
        </div>

        <BlogListClient blogs={blogs} />
      </div>
    </div>
  );
}
