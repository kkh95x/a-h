"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logScan } from "@/lib/scanClient";

function estimatePasswordStrength(password) {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasDigit) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;
  if (charsetSize === 0 && length > 0) charsetSize = 10;
  const entropy = length > 0 ? Math.log2(charsetSize) * length : 0;
  const guessesPerSecond = 1e9;
  const seconds = entropy > 0 ? Math.pow(2, entropy) / guessesPerSecond : 0;
  let strength = "weak";
  if (entropy >= 60 && length >= 10 && hasLower && hasUpper && hasDigit && hasSymbol) {
    strength = "strong";
  } else if (entropy >= 40 && length >= 8 && ((hasLower && hasUpper) || hasDigit || hasSymbol)) {
    strength = "medium";
  }
  const charsetDesc = [];
  if (hasLower) charsetDesc.push("حروف صغيرة");
  if (hasUpper) charsetDesc.push("حروف كبيرة");
  if (hasDigit) charsetDesc.push("أرقام");
  if (hasSymbol) charsetDesc.push("رموز خاصة");
  if (!charsetDesc.length) charsetDesc.push("نوع واحد فقط من الأحرف");
  return { length, charsetDesc: charsetDesc.join(" + "), seconds, strength };
}

function formatTime(seconds) {
  if (seconds <= 0) return "لحظات";
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;
  const century = 100 * year;
  if (seconds < minute) return "ثوانٍ معدودة";
  if (seconds < hour) return `${Math.round(seconds / minute)} دقيقة تقريباً`;
  if (seconds < day) return `${Math.round(seconds / hour)} ساعة تقريباً`;
  if (seconds < year) return `${Math.round(seconds / day)} يوم تقريباً`;
  if (seconds < century) return `${Math.round(seconds / year)} سنة تقريباً`;
  return "أكثر من قرن (نظرياً)";
}

function buildSuggestions(pw, info) {
  const suggestions = [];
  if (info.length < 12) suggestions.push("استخدم طول لا يقل عن 12 حرفاً لزيادة صعوبة الكسر.");
  if (!/[a-z]/.test(pw)) suggestions.push("أضف حروفاً صغيرة (a-z).");
  if (!/[A-Z]/.test(pw)) suggestions.push("أضف حروفاً كبيرة (A-Z).");
  if (!/[0-9]/.test(pw)) suggestions.push("أضف أرقاماً (0-9).");
  if (!/[^A-Za-z0-9]/.test(pw)) suggestions.push("أضف رموزاً خاصة مثل ! @ # $ % ^ & *.");
  if (!suggestions.length && info.length > 0) {
    suggestions.push("كلمة المرور قوية. تأكد من عدم إعادة استخدامها في أكثر من حساب.");
  }
  return suggestions;
}

export default function PasswordPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [logged, setLogged] = useState("");

  const info = pw ? estimatePasswordStrength(pw) : null;
  const widthPct = info ? (info.strength === "weak" ? 33 : info.strength === "medium" ? 66 : 100) : 0;
  const label = info ? (info.strength === "weak" ? "ضعيفة" : info.strength === "medium" ? "متوسطة" : "قوية") : "";

  async function maybeLog(nextPw) {
    if (!nextPw || nextPw === logged) return;
    const data = estimatePasswordStrength(nextPw);
    const ar = data.strength === "weak" ? "قوة ضعيفة" : data.strength === "medium" ? "قوة متوسطة" : "قوة قوية";
    await logScan({ type: "pass", target: "********", result: ar, risk: data.strength === "strong" ? "low" : data.strength === "medium" ? "medium" : "high" });
    setLogged(nextPw);
  }

  return (
    <div className="pass-body" style={{ minHeight: "100vh" }}>
      <Header />
      <main className="pass-wrapper">
        <section className="pass-card">
          <div className="pass-header">
            <div className="pass-icon">
              <i className="fas fa-key"></i>
            </div>
            <div>
              <h1>قياس قوة كلمة المرور</h1>
              <p>
                أدخل كلمة المرور ليتم تحليل طولها وتعقيدها محلياً في المتصفح. لا يتم إرسال كلمة المرور إلى
                الخادم.
              </p>
            </div>
          </div>
          <form className="pass-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="passInput">كلمة المرور</label>
            <div className="pass-input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type={show ? "text" : "password"}
                id="passInput"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onBlur={() => maybeLog(pw)}
                placeholder="أدخل كلمة مرور للتجربة..."
              />
              <button type="button" className="toggle-password" onClick={() => setShow((v) => !v)}>
                <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            <p className="pass-hint">لا تستخدم كلمة مرور حساباتك الحقيقية أثناء التجربة.</p>
          </form>
          {info ? (
            <section className="pass-result">
              <div className="pass-score-row">
                <span>مستوى القوة:</span>
                <span className={`pass-strength-label strength-${info.strength === "weak" ? "weak" : info.strength}`}>
                  {label}
                </span>
              </div>
              <div className="pass-meter">
                <div className="pass-meter-fill" style={{ width: `${widthPct}%` }}></div>
              </div>
              <ul className="pass-result-list">
                <li>
                  <span>الطول:</span> <strong>{info.length} حروف</strong>
                </li>
                <li>
                  <span>تنوع الأحرف:</span> <strong>{info.charsetDesc}</strong>
                </li>
                <li>
                  <span>تقدير الزمن لكسرها (Brute Force):</span> <strong>{formatTime(info.seconds)}</strong>
                </li>
              </ul>
              <h3 className="pass-suggest-title">نصائح لتحسين كلمة المرور:</h3>
              <ul className="pass-suggest-list">
                {buildSuggestions(pw, info).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="pass-note">هذه الأداة تقدّم تقديرات تقريبية فقط. يُحفظ مستوى القوة دون كلمة المرور.</p>
            </section>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
