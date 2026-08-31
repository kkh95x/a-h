"use client";

import { useEffect, useState } from "react";

const empty = {
  title: "",
  text: "",
  email: "",
  github: "",
  linkedin: "",
};

export default function AdminContactPage() {
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site")
      .then((r) => r.json())
      .then((site) => {
        setForm({
          title: site.contact?.title || "",
          text: site.contact?.text || "",
          email: site.contact?.email || "",
          github: site.contact?.github || "",
          linkedin: site.contact?.linkedin || "",
        });
      });
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: form }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "فشل الحفظ");
      return;
    }
    setMsg("تم حفظ بيانات التواصل");
  }

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>بيانات التواصل</h1>
          <p>تظهر في صفحة التواصل، أسفل الصفحة الرئيسية، وروابط الفوتر.</p>
        </div>
      </header>
      <section className="dash-card">
        <form className="admin-form" onSubmit={onSubmit}>
          <label>العنوان</label>
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} required />
          <label>النص التعريفي</label>
          <textarea value={form.text} onChange={(e) => setField("text", e.target.value)} />
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="name@example.com"
          />
          <label>رابط GitHub</label>
          <input
            type="url"
            dir="ltr"
            value={form.github}
            onChange={(e) => setField("github", e.target.value)}
            placeholder="https://github.com/username"
          />
          <label>رابط LinkedIn</label>
          <input
            type="url"
            dir="ltr"
            value={form.linkedin}
            onChange={(e) => setField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <div className="admin-actions">
            <button type="submit" className="btn-login-submit" style={{ width: "auto", margin: 0 }} disabled={saving}>
              {saving ? "جاري الحفظ..." : "حفظ التواصل"}
            </button>
          </div>
          {msg ? <p className="dash-card-sub">{msg}</p> : null}
        </form>
      </section>
    </>
  );
}
