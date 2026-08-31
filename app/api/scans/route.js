import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const db = await readDb();
  return NextResponse.json(db.scans || []);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const scan = {
    id: `scan-${Date.now()}`,
    type: ["url", "email", "pass", "file"].includes(body.type) ? body.type : "url",
    target: String(body.target || "").slice(0, 200),
    result: String(body.result || "").slice(0, 200),
    risk: ["low", "medium", "high"].includes(body.risk) ? body.risk : "low",
    date: new Date().toISOString().replace("T", " ").slice(0, 16),
  };

  await updateDb((db) => {
    db.scans = [scan, ...(db.scans || [])].slice(0, 200);
    return db;
  });

  return NextResponse.json(scan, { status: 201 });
}
