import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.academy || []);
}

export async function PUT(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { id, progress } = body;
  let updated = null;

  await updateDb((db) => {
    db.academy = (db.academy || []).map((lvl) => {
      if (lvl.id !== id) return lvl;
      updated = { ...lvl, progress: Math.max(0, Math.min(100, Number(progress) || 0)) };
      return updated;
    });
    return db;
  });

  if (!updated) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(updated);
}
