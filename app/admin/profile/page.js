import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export default async function ProfilePage() {
  const db = await readDb();
  const session = await getSession();
  const time = new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <header className="dash-topbar">
        <div className="dash-top-left">
          <h1>الملف الشخصي</h1>
          <p>بيانات المشرف من البيئة وملف JSON.</p>
        </div>
      </header>
      <section className="dash-profile-layout">
        <div className="dash-card dash-profile-main">
          <div className="dash-profile-header">
            <div className="dash-profile-avatar">
              <img src="/my-photo.png" alt="" />
            </div>
            <div>
              <h2>{db.site.about.name}</h2>
              <p>{db.site.about.title}</p>
              <span className="dash-badge safe">حساب موثق</span>
            </div>
          </div>
          <div className="dash-profile-info">
            <div>
              <span className="label">اسم المستخدم</span>
              <span className="value">{session?.u}</span>
            </div>
            <div>
              <span className="label">الدور</span>
              <span className="value">Owner / Admin</span>
            </div>
            <div>
              <span className="label">المصدر</span>
              <span className="value">ADMIN_USERNAME في .env.local</span>
            </div>
            <div>
              <span className="label">آخر تسجيل دخول</span>
              <span className="value">اليوم - {time}</span>
            </div>
          </div>
        </div>
        <div className="dash-card dash-profile-side">
          <h3>إعدادات سريعة</h3>
          <ul className="dash-profile-actions">
            <li>
              <i className="fas fa-key"></i> غيّر كلمة المرور من ملف .env.local
            </li>
            <li>
              <i className="fas fa-database"></i> البيانات في data/db.json
            </li>
            <li>
              <i className="fas fa-palette"></i> الأنماط محفوظة في app/globals.css
            </li>
          </ul>
          <p className="dash-profile-note">
            تسجيل الدخول يعتمد على ADMIN_USERNAME و ADMIN_PASSWORD في البيئة، وليس على ملف JSON.
          </p>
        </div>
      </section>
    </>
  );
}
