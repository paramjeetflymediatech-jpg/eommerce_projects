import { notFound } from "next/navigation";
import Link from "next/link";
import parse from "html-react-parser";
import { Blog, ensureDB } from "@/lib/models";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  await ensureDB();

  let blog: any = null;
  try {
    blog = await Blog.findOne({
      where: { slug, isPublished: true },
      raw: true,
    });
  } catch (e) {
    console.error("Failed to fetch blog", e);
  }

  if (!blog) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Article Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
          <Link href="/blogs" style={{ color: "#666", textDecoration: "none" }}>← The Journal</Link>
          <span style={{ color: "#ccc" }}>/</span>
          <span style={{ color: "#000", fontWeight: 600 }}>{new Date(blog.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>
        
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1, fontWeight: 400, margin: "0 0 24px", color: "#111", fontFamily: "var(--font-playfair, serif)" }}>
          {blog.title}
        </h1>

        {blog.author && (
          <div style={{ fontSize: "1.1rem", color: "#666", fontStyle: "italic", fontFamily: "var(--font-playfair, serif)" }}>
            Words by {blog.author}
          </div>
        )}
      </div>

      {/* Hero Image */}
      {blog.image && (
        <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", height: "auto", maxHeight: "700px", overflow: "hidden" }}>
          <img 
            src={blog.image} 
            alt={blog.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} 
          />
        </div>
      )}

      {/* Article Content */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "clamp(30px, 5vw, 60px) 24px clamp(50px, 10vw, 100px)" }}>
        <div className="blog-content" style={{ fontSize: "clamp(1.05rem, 3vw, 1.15rem)", lineHeight: 1.8, color: "#333" }}>
          {parse(blog.content)}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-content * {
          max-width: 100% !important;
        }
        .blog-content p {
          margin-bottom: 28px;
        }
        .blog-content h2, .blog-content h3 {
          margin-top: 48px;
          margin-bottom: 24px;
          color: #111;
          font-weight: 500;
          font-family: var(--font-playfair, serif);
        }
        .blog-content h2 { fontSize: clamp(1.5rem, 4vw, 2rem); }
        .blog-content h3 { fontSize: clamp(1.25rem, 3vw, 1.5rem); }
        .blog-content img {
          max-width: 100%;
          height: auto !important;
          margin: 32px 0;
          border-radius: 4px;
        }
        .blog-content iframe {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
        }
        .blog-content blockquote {
          border-left: 2px solid #000;
          margin: clamp(20px, 4vw, 40px) 0;
          padding: 20px 0 20px clamp(15px, 3vw, 30px);
          font-size: clamp(1.2rem, 3vw, 1.5rem);
          font-style: italic;
          color: #111;
          font-family: var(--font-playfair, serif);
          background: #fdfdfd;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 28px;
          padding-left: 24px;
        }
        .blog-content li {
          margin-bottom: 12px;
        }
        .blog-content a {
          color: #000;
          text-decoration: underline;
          text-underline-offset: 4px;
          word-break: break-word;
        }
      `}} />
    </div>
  );
}
