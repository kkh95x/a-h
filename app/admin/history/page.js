"use client";

import { useEffect, useMemo, useState } from "react";

const typeLabel = { url: "رابط", email: "إيميل", pass: "كلمة مرور", file: "ملف" };
const riskLabel = { high: "عالٍ", medium: "متوسط", low: "منخفض" };

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [type, setType] = useState("all");
  const [risk, setRisk] = useState("all");

  useEffect(() => {
    fetch("/api/scans")
      .then((r) => r.json())
      .then((d) => setScans(Array.isArray(d) ? d : []));
  }, []);

  const filtered = useMemo(
    () =>
      scans.filter((s) => (type === "all" ? true : s.type === type)).filter((s) => (risk === "all" ? true : s.risk === risk)),
    [scans, type, risk]
  );

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>سجل الفحوصات</h1>
          <p>كل الفحوصات المحفوظة في data/db.json</p>
        </div>
      </header>
      <section className="dash-card">
        <div className="dash-history-filters">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">كل الأنواع</option>
            <option value="url">روابط</option>
            <option value="email">إيميلات</option>
            <option value="pass">كلمات مرور</option>
            <option value="file">ملفات</option>
          </select>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option value="all">كل مستويات الخطر</option>
            <option value="low">منخفض</option>
            <option value="medium">متوسط</option>
            <option value="high">عالٍ</option>
          </select>
        </div>
        <div className="dash-table-wrapper">
          <table className="dash-table">
            <thead>
              <tr>
                <th>النوع</th>
                <th>الهدف</th>
                <th>النتيجة</th>
                <th>الخطر</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{typeLabel[row.type] || row.type}</td>
                  <td dir="ltr" style={{ textAlign: "left" }}>
                    {row.target}
                  </td>
                  <td>{row.result}</td>
                  <td>{riskLabel[row.risk] || row.risk}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
