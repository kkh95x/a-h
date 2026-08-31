"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", icon: "fa-home", label: "الرئيسية" },
  { href: "/admin/articles", icon: "fa-newspaper", label: "المقالات" },
  { href: "/admin/history", icon: "fa-history", label: "سجل الفحوصات" },
  { href: "/admin/academy", icon: "fa-graduation-cap", label: "الأكاديمية" },
  { href: "/admin/contact", icon: "fa-envelope", label: "التواصل" },
  { href: "/admin/profile", icon: "fa-user-shield", label: "الملف الشخصي" },
];

export default function AdminShell({ children, username }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="dash-body">
      <div className="dash-mobile-bar">
        <span className="dash-logo" style={{ margin: 0, fontSize: 16 }}>
          <i className="fas fa-shield-alt"></i>
          <span>
            cyber<span>Scan</span>
          </span>
        </span>
        <button className="btn-small" type="button" onClick={() => setOpen((v) => !v)}>
          القائمة
        </button>
      </div>
      <div className="dash-layout">
        <aside className={`dash-sidebar ${open ? "mobile-open" : ""}`}>
          <div className="dash-logo">
            <i className="fas fa-shield-alt"></i>
            <span>
              cyber<span>Scan</span>
            </span>
          </div>
          <nav className="dash-nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`dash-nav-item ${pathname === item.href ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="dash-sidebar-footer">
            <Link href="/" className="dash-back-link">
              <i className="fas fa-arrow-right"></i>
              العودة للموقع
            </Link>
            <button className="dash-logout" type="button" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>تسجيل الخروج</span>
            </button>
            <span style={{ color: "#9c9c9c" }}>{username}</span>
          </div>
        </aside>
        <main className="dash-main">{children}</main>
      </div>
    </div>
  );
}
