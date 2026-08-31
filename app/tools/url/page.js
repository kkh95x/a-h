"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { logScan } from "@/lib/scanClient";

function classifyUrl(urlString) {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    const scheme = url.protocol.replace(":", "");
    let risk = "low";
    let category = "Safe / Informational";
    let phishing = "منخفضة";
    const suspiciousWords = ["login", "verify", "update", "secure", "bank", "paypal"];
    const tldSuspicious = [".ru", ".cn", ".zip"];

    if (tldSuspicious.some((tld) => hostname.endsWith(tld))) {
      risk = "high";
      category = "Suspicious / Possible Malware";
      phishing = "مرتفعة";
    } else if (suspiciousWords.some((w) => url.pathname.toLowerCase().includes(w))) {
      risk = "medium";
      category = "Potential Phishing";
      phishing = "متوسطة";
    }

    return { hostname, scheme, https: scheme === "https", risk, category, phishing };
  } catch {
    return null;
  }
}

export default function UrlScannerPage() {
  const [value, setValue] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const result = classifyUrl(value.trim());
    if (!result) {
      setError("الرجاء إدخال رابط صالح (URL) بصيغة صحيحة.");
      setData(null);
      return;
    }
    setError("");
    setData(result);
    await logScan({
      type: "url",
      target: value.trim(),
      result: result.category,
      risk: result.risk,
    });
  }

  return (
    <div className="url-body" style={{ minHeight: "100vh" }}>
      <Header />
      <main className="url-wrapper">
        <section className="url-card">
          <div className="url-header">
            <div className="url-icon">
              <i className="fas fa-link"></i>
            </div>
            <div>
              <h1>أداة فحص الروابط</h1>
              <p>
                أدخل الرابط الذي تريد فحصه، وسنقوم بتحليله لاكتشاف الروابط الخبيثة أو المشبوهة قبل أن تقوم
                بفتحه.
              </p>
            </div>
          </div>
          <form className="url-form" onSubmit={onSubmit}>
            <label htmlFor="urlInput">الرابط المراد فحصه</label>
            <div className="url-input-wrapper">
              <i className="fas fa-globe"></i>
              <input
                type="url"
                id="urlInput"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com/malicious-link"
                required
              />
              <button type="submit" className="btn-url-scan">
                <i className="fas fa-search"></i> فحص الرابط
              </button>
            </div>
            <p className="url-hint">
              لا تقم بإدخال كلمات مرور أو بيانات حساسة في هذه الخانة، فقط عنوان الرابط (URL) المراد تحليله.
            </p>
            {error ? <p className="login-error">{error}</p> : null}
          </form>
          {data ? (
            <section className="url-result">
              <h2>نتيجة الفحص</h2>
              <div className="url-result-status">
                <span
                  className={`risk-badge ${
                    data.risk === "high" ? "risk-high" : data.risk === "medium" ? "risk-med" : "risk-low"
                  }`}
                >
                  {data.risk === "high" ? "HIGH RISK" : data.risk === "medium" ? "MEDIUM RISK" : "LOW RISK"}
                </span>
                <span>{data.hostname}</span>
              </div>
              <ul className="url-result-list">
                <li>
                  <span>تصنيف الرابط:</span> <strong>{data.category}</strong>
                </li>
                <li>
                  <span>نوع البروتوكول:</span> <strong>{data.scheme}</strong>
                </li>
                <li>
                  <span>استخدام HTTPS:</span> <strong>{data.https ? "نعم" : "لا"}</strong>
                </li>
                <li>
                  <span>مؤشرات التصيد:</span> <strong>{data.phishing}</strong>
                </li>
              </ul>
              <p className="url-note">
                ملاحظة: هذه نتيجة تحليل قواعد محلية. يتم حفظ السجل في قاعدة JSON للمراجعة من لوحة المشرف.
              </p>
            </section>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
