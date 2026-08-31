"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({ loginHref = "/login" }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`header ${open ? "nav-open" : ""}`}>
      <nav className="container nav">
        <Link href="/" className="logo logo-link">
          <i className="fas fa-shield-alt"></i>
          <span>
            cyber<span>Scan</span>
          </span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <ul className="nav-links">
          <li>
            <Link href="/#home" onClick={() => setOpen(false)}>
              الرئيسية
            </Link>
          </li>
          <li>
            <Link href="/#tools" onClick={() => setOpen(false)}>
              الأدوات
            </Link>
          </li>
          <li>
            <Link href="/#articles" onClick={() => setOpen(false)}>
              المقالات
            </Link>
          </li>
          <li>
            <Link href="/#academy" onClick={() => setOpen(false)}>
              الأكاديمية
            </Link>
          </li>
          <li>
            <Link href="/#about" onClick={() => setOpen(false)}>
              عني
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={() => setOpen(false)}>
              تواصل
            </Link>
          </li>
        </ul>
        <Link href={loginHref} className="btn-login-link">
          <button className="btn-login" type="button">
            تسجيل الدخول
          </button>
        </Link>
      </nav>
    </header>
  );
}
