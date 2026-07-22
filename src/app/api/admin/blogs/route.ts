import { NextRequest, NextResponse } from "next/server";
import { Blog, ensureDB } from "@/lib/models";
import slugify from "slugify";

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const blogs = await Blog.findAll({ order: [["createdAt", "DESC"]] });
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    const { title, content, image, author, isPublished, metaTitle, metaDescription, keywords } = body;

    let slug = body.slug;
    if (!slug) {
      slug = slugify(title, { lower: true, strict: true });
    }

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      image,
      author,
      isPublished,
      metaTitle,
      metaDescription,
      keywords,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
