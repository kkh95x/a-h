import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.articles || []);
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const article = {
    id: `art-${Date.now()}`,
    title: String(body.title || "").trim(),
    excerpt: String(body.excerpt || "").trim(),
    content: String(body.content || "").trim(),
    tag: String(body.tag || "General").trim(),
    badge: String(body.badge || body.tag || "General").trim(),
    image: String(body.image || "").trim(),
    readTime: String(body.readTime || "5 دقائق").trim(),
    level: String(body.level || "مبتدئ").trim(),
    published: Boolean(body.published),
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString(),
  };

  if (!article.title) {
    return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
  }

  await updateDb((db) => {
    db.articles = [article, ...(db.articles || [])];
    return db;
  });

  return NextResponse.json(article, { status: 201 });
}
