import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-labelledby="footer-logo">
      <div className="container">
        {/* Grid */}
        <div className="footer__grid">
          {/* Brand column */}
          <div>
            <span className="footer__logo" id="footer-logo">
              DRIFULLY
            </span>
            <p className="footer__tagline">
              Rent a car your way — drive yourself or get a chauffeur. Fast,
              flexible, and hassle-free.
            </p>
          </div>

          {/* Link columns */}
          {[
            {
              title: "Company",
              links: [
                { label: "About Us", href: "/about-us" },
                { label: "Our Fleet", href: "/our-fleet" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Help Center", href: "/help" },
                { label: "Contact Us", href: "/contact-us" },
                { label: "Safety", href: "/safety" },
                { label: "Terms", href: "/terms" },
              ],
            },
            {
              title: "Download",
              links: [
                {
                  label: "Google Play",
                  href: "https://play.google.com/store",
                },
                { label: "App Store", href: "https://apps.apple.com" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="footer__col-title">{col.title}</p>
              <ul className="footer__links" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Drifully. All rights reserved.
          </p>
          <p className="footer__copy">
            <Link href="/privacy" className="footer__link">
              Privacy Policy
            </Link>
            {" · "}
            <Link href="/cookies" className="footer__link">
              Cookie Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
