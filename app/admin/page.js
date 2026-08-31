import { readDb } from "@/lib/db";

function typeLabel(type) {
  return { url: "رابط", email: "إيميل", pass: "كلمة مرور", file: "ملف" }[type] || type;
}

function riskClass(risk) {
  if (risk === "high") return "danger";
  if (risk === "medium") return "warn";
  return "safe";
}

function riskLabel(risk) {
  if (risk === "high") return "عالٍ";
  if (risk === "medium") return "متوسط";
  return "منخفض";
}

export default async function AdminHome() {
  const db = await readDb();
  const scans = db.scans || [];
  const byType = (t) => scans.filter((s) => s.type === t);
  const dateLabel = new Date().toLocaleDateString("ar-SY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { icon: "total", fa: "fa-chart-line", label: "إجمالي الفحوصات", value: scans.length, sub: "من ملف JSON" },
    { icon: "url", fa: "fa-link", label: "فحوصات الروابط", value: byType("url").length, sub: `${byType("url").filter((s) => s.risk === "high").length} خطِرة` },
    { icon: "email", fa: "fa-envelope-open-text", label: "فحوصات الإيميلات", value: byType("email").length, sub: `${byType("email").filter((s) => s.risk !== "low").length} بتسريبات` },
    { icon: "pass", fa: "fa-key", label: "فحوصات كلمات المرور", value: byType("pass").length, sub: "بدون تخزين كلمة المرور" },
    { icon: "file", fa: "fa-file-code", label: "فحوصات الملفات", value: byType("file").length, sub: "تحليل محلي" },
  ];

  const recent = scans.slice(0, 4);
  const table = scans.slice(0, 8);
  const bars = [40, 60, 80, 55, 70, 45, 30];

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>لوحة التحكم</h1>
          <p>نظرة عامة من قاعدة JSON على نشاط الفحوصات في cyberScan.</p>
        </div>
        <div className="dash-top-right">
          <div className="dash-top-date">
            <i className="fas fa-calendar-alt"></i>
            <span>{dateLabel}</span>
          </div>
          <div className="dash-user">
            <div className="dash-user-text">
              <span className="dash-user-name">{db.site.about.name}</span>
              <span className="dash-user-role">{db.site.about.title}</span>
            </div>
            <div className="dash-user-avatar">
              <img src="/my-photo.png" alt="" />
            </div>
          </div>
        </div>
      </header>

      <section className="dash-stats">
        {stats.map((s) => (
          <div className="dash-stat-card" key={s.label}>
            <div className={`dash-stat-icon ${s.icon}`}>
              <i className={`fas ${s.fa}`}></i>
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-label">{s.label}</span>
              <span className="dash-stat-value">{s.value}</span>
              <span className="dash-stat-sub">{s.sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="dash-row">
        <div className="dash-card dash-chart-card">
          <div className="dash-card-header">
            <h2>نشاط الفحوصات خلال الأسبوع</h2>
            <span className="dash-card-sub">تمثيل بصري من نفس أسلوب الموقع القديم</span>
          </div>
          <div className="dash-chart-placeholder">
            <div className="dash-chart-bars">
              {bars.map((h, i) => (
                <div className="bar" style={{ height: `${h}%` }} key={i}></div>
              ))}
            </div>
            <div className="dash-chart-legend">
              <span className="dot url"></span> روابط
              <span className="dot email"></span> إيميلات
              <span className="dot pass"></span> كلمات مرور
            </div>
          </div>
        </div>
        <div className="dash-card dash-recent-card">
          <div className="dash-card-header">
            <h2>أحدث الفحوصات</h2>
            <span className="dash-card-sub">آخر عمليات الفحص المحفوظة في JSON.</span>
          </div>
          <ul className="dash-recent-list">
            {recent.map((scan) => (
              <li className="dash-recent-item" key={scan.id}>
                <div className="dash-recent-left">
                  <span className="dash-recent-type">{typeLabel(scan.type)}</span>
                  <span className="dash-recent-target">{scan.target}</span>
                </div>
                <div className="dash-recent-right">
                  <span className={`dash-badge ${riskClass(scan.risk)}`}>{scan.result}</span>
                  <span>{scan.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="dash-card dash-table-card">
        <div className="dash-card-header">
          <h2>سجل الفحوصات (مختصر)</h2>
          <span className="dash-card-sub">البيانات تُقرأ من data/db.json</span>
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
              {table.map((row) => (
                <tr key={row.id}>
                  <td>{typeLabel(row.type)}</td>
                  <td dir="ltr" style={{ textAlign: "left" }}>
                    {row.target}
                  </td>
                  <td>{row.result}</td>
                  <td>{riskLabel(row.risk)}</td>
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
