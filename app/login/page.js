"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }
      router.push(params.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <section className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-shield-alt"></i>
            <span>
              cyber<span>Scan</span>
            </span>
          </div>
          <h1>تسجيل دخول المشرف</h1>
          <p>أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة التحكم.</p>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                aria-label="إظهار / إخفاء كلمة المرور"
                onClick={() => setShow((v) => !v)}
              >
                <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>
          {error ? <p className="login-error">{error}</p> : null}
          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            حساب المشرف يُضبط من ملف <span className="muted">.env.local</span>
          </p>
          <Link href="/" className="back-home">
            <i className="fas fa-arrow-right"></i> العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="login-body" style={{ minHeight: "100vh" }}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
