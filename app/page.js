import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { readDb } from "@/lib/db";

export default async function HomePage() {
  const db = await readDb();
  const { site, articles, academy } = db;
  const featured = (articles || []).filter((a) => a.published && a.featured).slice(0, 4);

  return (
    <>
      <Header />
      <main id="home" className="hero container">
        <section className="hero-content">
          <h1>
            cyber<span>Scan</span>
          </h1>
          <h2>{site.heroTitle}</h2>
          <p>{site.heroText}</p>
          <div className="hero-buttons">
            <Link href="/#tools" className="btn-primary" style={{ textDecoration: "none" }}>
              ابدأ الآن
            </Link>
            <Link href="/#tools" className="btn-outline" style={{ textDecoration: "none" }}>
              استكشف الأدوات
            </Link>
          </div>
        </section>
        <section className="hero-image">
          <div className="hero-image-inner">
            <div className="photo-wrapper">
              <img src="/my-photo.png" alt="Cyber Security Specialist" />
            </div>
            <p className="hero-name-title">{site.about.heroCaption}</p>
          </div>
        </section>
      </main>

      <section id="tools" className="features container">
        <Link href="/tools/url" className="feature-card feature-link">
          <i className="fas fa-link icon-url"></i>
          <h3>فحص الروابط</h3>
          <p>تحليل الروابط واكتشاف الروابط الخبيثة والمشبوهة قبل فتحها.</p>
        </Link>
        <Link href="/tools/email" className="feature-card feature-link">
          <i className="fas fa-envelope-open-text icon-mail"></i>
          <h3>فحص الإيميلات</h3>
          <p>تحقق من تسريبات البريد الإلكتروني وكلمات المرور في قواعد البيانات المعروفة.</p>
        </Link>
        <Link href="/tools/password" className="feature-card feature-link">
          <i className="fas fa-key icon-pass"></i>
          <h3>قياس قوة كلمة المرور</h3>
          <p>تحليل قوة كلمات المرور وتقدير الوقت اللازم لكسرها بأساليب مختلفة.</p>
        </Link>
        <Link href="/tools/files" className="feature-card feature-link">
          <i className="fas fa-file-code icon-file"></i>
          <h3>
            فحص الملفات <span className="soon">تجريبي</span>
          </h3>
          <p>تحليل الملفات والبرمجيات للكشف عن الأنماط الخبيثة وسلوكيات الهجوم.</p>
        </Link>
      </section>

      <section id="articles" className="articles container">
        <div className="section-header">
          <h3>أحدث المقالات</h3>
          <Link href="/articles" className="view-all">
            عرض الكل
          </Link>
        </div>
        <div className="articles-grid">
          {featured.map((art) => (
            <Link key={art.id} href={`/articles/${art.id}`} className="article-card article-link">
              <div className="art-img">
                <img src={art.image} alt={art.title} />
              </div>
              <h4>{art.title}</h4>
              <span className="tag">{art.tag}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="academy" className="academy container">
        <div className="section-header">
          <h3>
            Cyber Academy <span className="soon">قريباً</span>
          </h3>
          <p>مستويات تدريبية من الأساسيات حتى الاحتراف في الاختراق الأخلاقي و Red Teaming.</p>
        </div>
        <div className="academy-grid">
          {(academy || []).map((lvl) => (
            <div className="academy-card" key={lvl.id}>
              <div className="academy-img">
                <img src={lvl.image} alt={lvl.title} />
              </div>
              <h4>{lvl.level}</h4>
              <p>{lvl.title}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="about-page container" id="about">
        <section className="about-page-card">
          <div className="about-page-photo">
            <img src="/my-photo.png" alt={`${site.about.name} - ${site.about.title}`} />
          </div>
          <div className="about-page-text">
            <span className="about-label">👨‍💻 الملف الشخصي</span>
            <h1 className="about-name">{site.about.name}</h1>
            <p className="about-title">{site.about.title}</p>
            {(site.about.bio || []).map((p, i) => (
              <p className="about-bio" key={i}>
                {p}
              </p>
            ))}
            <div className="about-page-tags">
              {(site.about.tags || []).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="about-page-meta">
              <div>
                <span className="meta-label">Education</span>
                <span className="meta-value">{site.about.education}</span>
              </div>
              <div>
                <span className="meta-label">Training</span>
                <span className="meta-value">{site.about.training}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ContactSection contact={site.contact} />
      <Footer />
    </>
  );
}
