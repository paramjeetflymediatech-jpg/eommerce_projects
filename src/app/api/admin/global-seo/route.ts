import { NextRequest, NextResponse } from "next/server";
import { GlobalSeo, ensureDB } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const globalSeo = await GlobalSeo.findOne({ where: { id: 1 } });
    if (!globalSeo) {
      // Create empty defaults if none exist
      const newGlobalSeo = await GlobalSeo.create({ id: 1 });
      return NextResponse.json(newGlobalSeo);
    }
    return NextResponse.json(globalSeo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    let globalSeo = await GlobalSeo.findOne({ where: { id: 1 } });
    
    if (!globalSeo) {
      globalSeo = await GlobalSeo.create({ id: 1, ...body });
    } else {
      await globalSeo.update(body);
    }

    return NextResponse.json(globalSeo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
