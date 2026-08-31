import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.site || {});
}

export async function PUT(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const db = await updateDb((current) => {
    current.site = {
      ...current.site,
      ...body,
      about: { ...(current.site?.about || {}), ...(body.about || {}) },
      contact: { ...(current.site?.contact || {}), ...(body.contact || {}) },
    };
    return current;
  });

  return NextResponse.json(db.site);
}
