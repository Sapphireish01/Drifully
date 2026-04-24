"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar" aria-label="Main navigation">
      {/* Logo */}
      <Link href="/" className="navbar__logo-link" aria-label="Drifully home">
        <Image
          src="/images/logo.svg"
          alt="Drifully"
          width={120}
          height={36}
          priority
        />
      </Link>

      {/* Nav links */}
      <ul className="navbar__nav" role="list">
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className="navbar__link"
                data-active={isActive ? true : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <Link href="/download" className="btn btn-primary btn-sm">
        Download App
      </Link>
    </nav>
  );
}
