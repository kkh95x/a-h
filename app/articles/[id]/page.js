import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readDb } from "@/lib/db";

export default async function ArticlePage({ params }) {
  const { id } = await params;
  const db = await readDb();
  const art = (db.articles || []).find((a) => a.id === id && a.published);
  if (!art) notFound();

  return (
    <>
      <Header />
      <article className="article-detail container">
        <div className="art-img">
          <img src={art.image} alt={art.title} />
        </div>
        <span className="tag">{art.tag}</span>
        <h1>{art.title}</h1>
        <div className="article-detail-meta">
          <span>
            <i className="fas fa-clock"></i> {art.readTime}
          </span>
          <span>
            <i className="fas fa-layer-group"></i> {art.level}
          </span>
        </div>
        <p className="article-body">{art.content}</p>
        <Link href="/articles" className="back-home" style={{ marginTop: 20, display: "inline-flex" }}>
          <i className="fas fa-arrow-right"></i> كل المقالات
        </Link>
      </article>
      <Footer />
    </>
  );
}
