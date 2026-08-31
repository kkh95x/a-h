"use client";

import { useEffect, useState } from "react";

export default function AcademyAdminPage() {
  const [levels, setLevels] = useState([]);

  async function load() {
    const res = await fetch("/api/academy");
    setLevels(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function save(id, progress) {
    await fetch("/api/academy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, progress }),
    });
    load();
  }

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>Cyber Academy</h1>
          <p>تحديث نسبة التقدم لكل مستوى في ملف JSON.</p>
        </div>
      </header>
      <section className="dash-academy-grid">
        {levels.map((lvl) => (
          <div className="dash-academy-card" key={lvl.id}>
            <div className="lvl-header">
              <span className="lvl-badge">{lvl.level}</span>
              <span className="lvl-progress-label">{lvl.progress}% مكتمل</span>
            </div>
            <h3>{lvl.title}</h3>
            <div className="lvl-progress-bar">
              <div className="lvl-progress-fill" style={{ width: `${lvl.progress}%` }}></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={lvl.progress}
              onChange={(e) =>
                setLevels((all) => all.map((x) => (x.id === lvl.id ? { ...x, progress: Number(e.target.value) } : x)))
              }
              onMouseUp={(e) => save(lvl.id, e.target.value)}
              onTouchEnd={(e) => save(lvl.id, e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </section>
    </>
  );
}
