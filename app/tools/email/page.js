"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logScan } from "@/lib/scanClient";

function mockCheckEmailBreach(email) {
  const lower = email.toLowerCase();
  const riskyDomains = ["yahoo.com", "hotmail.com", "example-leak.com"];
  const safeDomains = ["proton.me", "tutanota.com"];
  const domain = lower.split("@")[1] || "";
  let breached = false;
  let count = 0;
  let sources = [];

  if (riskyDomains.some((d) => domain.endsWith(d))) {
    breached = true;
    count = 3;
    sources = ["Combo List 2019", "Credential Stuffing Set", "Public Leak Archive"];
  } else if (!safeDomains.some((d) => domain.endsWith(d))) {
    breached = true;
    count = 1;
    sources = ["Generic Breach Database"];
  }

  const advice = breached
    ? "قم بتغيير كلمة المرور فوراً، واستخدم كلمة مرور قوية وفريدة لهذا الحساب، وفعل المصادقة الثنائية إن أمكن."
    : "لا توجد تسريبات معروفة لهذا البريد في قواعد البيانات التجريبية، مع ذلك استخدم كلمات مرور قوية ومختلفة لكل حساب.";

  return { breached, count, sources, advice };
}

export default function EmailCheckerPage() {
  const [email, setEmail] = useState("");
  const [res, setRes] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const result = mockCheckEmailBreach(email.trim());
    setRes(result);
    await logScan({
      type: "email",
      target: email.trim(),
      result: result.breached ? `${result.count} تسريبات` : "لا توجد تسريبات معروفة",
      risk: result.breached ? (result.count > 1 ? "high" : "medium") : "low",
    });
  }

  return (
    <div className="email-body" style={{ minHeight: "100vh" }}>
      <Header />
      <main className="email-wrapper">
        <section className="email-card">
          <div className="email-header">
            <div className="email-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div>
              <h1>فحص الإيميلات من التسريبات</h1>
              <p>
                أدخل بريدك الإلكتروني لمعرفة ما إذا كان قد ظهر في قواعد بيانات تسريبات كلمات المرور المعروفة.
                لا نقوم بطلب أو تخزين كلمات المرور الخاصة بك.
              </p>
            </div>
          </div>
          <form className="email-form" onSubmit={onSubmit}>
            <label htmlFor="emailInput">البريد الإلكتروني المراد فحصه</label>
            <div className="email-input-wrapper">
              <i className="fas fa-at"></i>
              <input
                type="email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
              <button type="submit" className="btn-email-scan">
                <i className="fas fa-search"></i> فحص البريد
              </button>
            </div>
            <p className="email-hint">
              هذه الأداة مخصّصة لفحص التسريبات المعروفة فقط. لا تدخل كلمات المرور هنا.
            </p>
          </form>
          {res ? (
            <section className="email-result">
              <h2>نتيجة الفحص</h2>
              <div className="email-result-status">
                <span className={`breach-badge ${res.breached ? "breach-found" : "breach-none"}`}>
                  {res.breached ? "تم العثور على تسريبات محتملة" : "لا توجد تسريبات معروفة"}
                </span>
                <span>{email}</span>
              </div>
              <ul className="email-result-list">
                <li>
                  <span>عدد قواعد البيانات المتطابقة:</span> <strong>{res.count}</strong>
                </li>
                <li>
                  <span>تسريبات محتملة:</span> <strong>{res.sources.length ? res.sources.join(", ") : "—"}</strong>
                </li>
                <li>
                  <span>توصية أمنية:</span> <strong>{res.advice}</strong>
                </li>
              </ul>
              <p className="email-note">
                تنبيه: هذه نتيجة تجريبية محلية. يُحفظ السجل في ملف JSON دون تخزين كلمات المرور.
              </p>
            </section>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
