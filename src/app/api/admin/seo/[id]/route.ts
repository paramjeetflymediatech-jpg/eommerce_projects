import { NextRequest, NextResponse } from "next/server";
import { Seo, ensureDB } from "@/lib/models";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDB();
    const resolvedParams = await params;
    const seo = await Seo.findByPk(resolvedParams.id);
    if (!seo) {
      return NextResponse.json({ error: "SEO settings not found" }, { status: 404 });
    }
    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDB();
    const resolvedParams = await params;
    const seo = await Seo.findByPk(resolvedParams.id);
    if (!seo) {
      return NextResponse.json({ error: "SEO settings not found" }, { status: 404 });
    }
    const body = await request.json();
    
    if (body.pagePath && body.pagePath !== seo.pagePath) {
      const existing = await Seo.findOne({ where: { pagePath: body.pagePath } });
      if (existing) {
        return NextResponse.json({ error: "SEO settings for this path already exist" }, { status: 400 });
      }
    }

    await seo.update(body);
    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDB();
    const resolvedParams = await params;
    const seo = await Seo.findByPk(resolvedParams.id);
    if (!seo) {
      return NextResponse.json({ error: "SEO settings not found" }, { status: 404 });
    }
    await seo.destroy();
    return NextResponse.json({ message: "SEO settings deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
