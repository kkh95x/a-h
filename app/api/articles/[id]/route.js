import { NextResponse } from "next/server";
import { updateDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  let updated = null;

  await updateDb((db) => {
    db.articles = (db.articles || []).map((a) => {
      if (a.id !== id) return a;
      updated = {
        ...a,
        title: body.title ?? a.title,
        excerpt: body.excerpt ?? a.excerpt,
        content: body.content ?? a.content,
        tag: body.tag ?? a.tag,
        badge: body.badge ?? a.badge,
        image: body.image ?? a.image,
        readTime: body.readTime ?? a.readTime,
        level: body.level ?? a.level,
        published: body.published ?? a.published,
        featured: body.featured ?? a.featured,
      };
      return updated;
    });
    return db;
  });

  if (!updated) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  let removed = false;

  await updateDb((db) => {
    const before = db.articles?.length || 0;
    db.articles = (db.articles || []).filter((a) => a.id !== id);
    removed = db.articles.length !== before;
    return db;
  });

  if (!removed) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
