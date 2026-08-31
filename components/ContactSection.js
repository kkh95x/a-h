export default function ContactSection({ contact }) {
  const c = contact || {};
  const links = [
    c.email && { href: `mailto:${c.email}`, icon: "fas fa-envelope", label: "Email" },
    c.github && { href: c.github, icon: "fab fa-github", label: "GitHub", external: true },
    c.linkedin && { href: c.linkedin, icon: "fab fa-linkedin", label: "LinkedIn", external: true },
  ].filter(Boolean);

  return (
    <section id="contact" className="contact container">
      <h3>{c.title || "تواصل معي"}</h3>
      <p>{c.text || "للاستفسارات، التعاون، أو اقتراح أفكار جديدة لمنصة cyberScan."}</p>
      <div className="contact-links">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
          >
            <i className={link.icon}></i> {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
