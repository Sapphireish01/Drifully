"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { performSearch, hydrateSearchIndex } from "@/lib/searchData";
import SearchDropdown from "@/components/search/SearchDropdown";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Fleet", href: "/our-fleet" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Drive with Drifully", href: "/drive-with-drifully" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [downloadLink, setDownloadLink] = useState("https://play.google.com/store/apps/details?id=com.drifully.app");

  // Hydrate search index in background on mount
  useEffect(() => {
    hydrateSearchIndex();
  }, []);

  // Close menu & search when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsSearchExpanded(false);
    setSearchQuery("");
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Detect iOS download link
  useEffect(() => {
    if (typeof window !== "undefined" && window.navigator) {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOS =
        /ipad|iphone|ipod/.test(userAgent) ||
        (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints > 2 && /macintosh/.test(userAgent));
      if (isIOS) {
        setDownloadLink("https://apps.apple.com/ng/app/drifully/id6782419021");
      }
    }
  }, []);

  // Handle click outside to close search popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsSearchExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
  };

  const searchResults = performSearch(searchQuery);

  const SearchIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.58464 17.5C13.9569 17.5 17.5013 13.9555 17.5013 9.58329C17.5013 5.21104 13.9569 1.66663 9.58464 1.66663C5.21238 1.66663 1.66797 5.21104 1.66797 9.58329C1.66797 13.9555 5.21238 17.5 9.58464 17.5Z"
        stroke="#868C98"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3346 18.3333L16.668 16.6666"
        stroke="#868C98"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link
          href="/"
          className={`navbar__logo-link ${isOpen ? "navbar__logo-link--hidden" : ""}`}
          aria-label="Drifully home"
        >
          <Image src="/images/logo.svg" alt="Drifully" width={120} height={36} priority />
        </Link>

        {/* Nav links / Mobile Menu */}
        <div className={`navbar__menu ${isOpen ? "is-open" : ""}`}>
          <div className="navbar__mobile-watermark" aria-hidden="true">
            DRIFULLY
          </div>
          <div className="navbar__mobile-header">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image src="/images/logo.svg" alt="Drifully" width={120} height={36} />
            </Link>
          </div>

          <ul className="navbar__nav" role="list">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.label} className="navbar__nav-item">
                  <Link
                    href={item.href}
                    className="navbar__link"
                    data-active={isActive ? true : undefined}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile CTA */}
          <Link href={downloadLink} className="btn btn-primary navbar__cta-mobile" onClick={() => setIsOpen(false)}>
            Download App
          </Link>
        </div>

        {/* Actions Container (Search + Download App CTA) */}
        {!isOpen && (
          <div className="navbar__actions">
            {/* Search Container */}
            <div ref={searchRef} className={`navbar__search ${isSearchExpanded ? "navbar__search--expanded" : ""}`}>
            {isSearchExpanded ? (
              <div className="navbar__search-input-wrapper">
                <span className="navbar__search-icon">{SearchIcon}</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="navbar__search-input"
                  placeholder="What would you like to search for"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search Drifully"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="navbar__search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6L18 18" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="navbar__search-btn"
                onClick={handleSearchClick}
                aria-label="Open search"
                title="Search (Cmd+K / Ctrl+K)"
              >
                {SearchIcon}
              </button>
            )}

            {/* Dropdown Results Popover */}
            {isSearchExpanded && searchQuery.trim().length > 0 && (
              <SearchDropdown query={searchQuery} results={searchResults} onItemClick={handleCloseSearch} />
            )}
          </div>

          {/* Desktop account and app actions */}
          <Link href="/customer/login" className="navbar__join-desktop">
            Join/Login
          </Link>
          <Link href={downloadLink} className="btn btn-primary btn-sm navbar__cta-desktop">
            Download App
          </Link>
        </div>
        )}

        {/* Mobile Toggle Button */}
        <button
          className="navbar__toggle"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}



