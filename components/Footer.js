"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [contact, setContact] = useState(null);

  useEffect(() => {
    fetch("/api/site")
      .then((r) => r.json())
      .then((site) => setContact(site.contact || {}))
      .catch(() => setContact({}));
  }, []);

  const c = contact || {};

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} cyberScan. جميع الحقوق محفوظة.</p>
        <nav className="footer-contact" aria-label="تواصل">
          <Link href="/contact">تواصل معي</Link>
          {c.email ? <a href={`mailto:${c.email}`}>Email</a> : null}
          {c.github ? (
            <a href={c.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          {c.linkedin ? (
            <a href={c.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </nav>
        <p className="footer-slogan">Scan. Learn. Protect.</p>
      </div>
    </footer>
  );
}
