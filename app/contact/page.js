import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { readDb } from "@/lib/db";

export const metadata = {
  title: "تواصل معي | cyberScan",
};

export default async function ContactPage() {
  const db = await readDb();

  return (
    <>
      <Header />
      <main className="contact-page">
        <ContactSection contact={db.site.contact} />
      </main>
      <Footer />
    </>
  );
}
