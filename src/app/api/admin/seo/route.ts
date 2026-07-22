import { NextRequest, NextResponse } from "next/server";
import { Seo, ensureDB } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const seos = await Seo.findAll();
    return NextResponse.json(seos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    
    // Check if path already exists
    const existing = await Seo.findOne({ where: { pagePath: body.pagePath } });
    if (existing) {
      return NextResponse.json({ error: "SEO settings for this path already exist" }, { status: 400 });
    }

    const newSeo = await Seo.create(body);
    return NextResponse.json(newSeo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
