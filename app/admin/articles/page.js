"use client";

import { useEffect, useState } from "react";

const empty = {
  title: "",
  excerpt: "",
  content: "",
  tag: "Phishing",
  badge: "",
  image: "",
  readTime: "5 دقائق",
  level: "مبتدئ",
  published: true,
  featured: false,
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/articles");
    setArticles(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const payload = { ...form, badge: form.badge || form.tag };
    const url = editing ? `/api/articles/${editing}` : "/api/articles";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      setMsg(data.error || "فشل الحفظ");
      return;
    }
    setMsg(editing ? "تم التحديث" : "تمت الإضافة");
    setForm(empty);
    setEditing(null);
    load();
  }

  async function remove(id) {
    if (!confirm("حذف المقال؟")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  }

  function edit(art) {
    setEditing(art.id);
    setForm({
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      tag: art.tag,
      badge: art.badge || "",
      image: art.image || "",
      readTime: art.readTime,
      level: art.level,
      published: art.published,
      featured: art.featured,
    });
  }

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>إدارة المقالات</h1>
          <p>إضافة وتعديل وحذف المقالات في ملف JSON.</p>
        </div>
      </header>
      <section className="dash-card" style={{ marginBottom: 16 }}>
        <div className="dash-card-header">
          <h2>{editing ? "تعديل مقال" : "مقال جديد"}</h2>
        </div>
        <form className="admin-form" onSubmit={onSubmit}>
          <label>العنوان</label>
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} required />
          <label>المختصر</label>
          <textarea value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} />
          <label>المحتوى</label>
          <textarea style={{ minHeight: 140 }} value={form.content} onChange={(e) => setField("content", e.target.value)} />
          <div className="admin-form-row">
            <div>
              <label>الوسم</label>
              <input value={form.tag} onChange={(e) => setField("tag", e.target.value)} />
            </div>
            <div>
              <label>الشارة</label>
              <input value={form.badge} onChange={(e) => setField("badge", e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div>
              <label>وقت القراءة</label>
              <input value={form.readTime} onChange={(e) => setField("readTime", e.target.value)} />
            </div>
            <div>
              <label>المستوى</label>
              <input value={form.level} onChange={(e) => setField("level", e.target.value)} />
            </div>
          </div>
          <label>رابط الصورة</label>
          <input value={form.image} onChange={(e) => setField("image", e.target.value)} placeholder="https://..." />
          <label className="checkbox-row">
            <input type="checkbox" checked={form.published} onChange={(e) => setField("published", e.target.checked)} />
            منشور
          </label>
          <label className="checkbox-row">
            <input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} />
            مميز في الصفحة الرئيسية
          </label>
          <div className="admin-actions">
            <button type="submit" className="btn-login-submit" style={{ width: "auto", margin: 0 }}>
              {editing ? "حفظ التعديل" : "إضافة المقال"}
            </button>
            {editing ? (
              <button
                type="button"
                className="btn-small"
                onClick={() => {
                  setEditing(null);
                  setForm(empty);
                }}
              >
                إلغاء
              </button>
            ) : null}
          </div>
          {msg ? <p className="dash-card-sub">{msg}</p> : null}
        </form>
      </section>
      <section className="dash-articles-grid">
        {articles.map((art) => (
          <div className="dash-article-card" key={art.id}>
            <span className="dash-article-badge">{art.tag}</span>
            <h3>{art.title}</h3>
            <p className="dash-article-meta">
              <span>{art.published ? "منشور" : "مسودة"}</span>
              <span>{art.featured ? "مميز" : ""}</span>
            </p>
            <div className="admin-actions">
              <button type="button" className="dash-article-btn" onClick={() => edit(art)}>
                تعديل
              </button>
              <button type="button" className="btn-danger" onClick={() => remove(art.id)}>
                حذف
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
