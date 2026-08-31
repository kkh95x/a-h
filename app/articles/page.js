import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readDb } from "@/lib/db";

export default async function ArticlesPage() {
  const db = await readDb();
  const list = (db.articles || []).filter((a) => a.published);

  return (
    <>
      <Header />
      <section className="ph-hero container">
        <div className="ph-hero-text">
          <span className="ph-label">Knowledge Base</span>
          <h1>المقالات التعليمية</h1>
          <p>
            مقالات من قاعدة JSON حول التصيد، حماية الحسابات، أمن الويب، ولينكس — يمكن للمشرف إدارتها من
            لوحة التحكم.
          </p>
        </div>
        <div className="ph-hero-badge">
          <i className="fas fa-fish"></i>
          <span>احذر الروابط الغريبة</span>
        </div>
      </section>
      <main className="ph-articles container">
        <section className="ph-grid">
          {list.map((art) => (
            <article className="ph-card" key={art.id}>
              <div className="ph-img">
                <img src={art.image} alt={art.title} />
              </div>
              <div className="ph-content">
                <span className="ph-tag">{art.badge || art.tag}</span>
                <h2>{art.title}</h2>
                <p>{art.excerpt}</p>
                <div className="ph-meta">
                  <span>
                    <i className="fas fa-clock"></i> {art.readTime}
                  </span>
                  <span>
                    <i className="fas fa-shield-alt"></i> {art.level}
                  </span>
                </div>
                <Link href={`/articles/${art.id}`} className="ph-read-btn" style={{ textDecoration: "none" }}>
                  قراءة المقال
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
