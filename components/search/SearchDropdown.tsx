"use client";

import Link from "next/link";
import { CategorizedSearchResults, SearchItem } from "@/lib/searchData";

interface SearchDropdownProps {
  query: string;
  results: CategorizedSearchResults;
  onItemClick: () => void;
}

export default function SearchDropdown({ query, results, onItemClick }: SearchDropdownProps) {
  const { fleet, blog, company, legal, faq, totalResults } = results;

  return (
    <div className="navbar__search-dropdown" role="region" aria-label="Search results">
      {/* Top Status Header */}
      <div className="search-dropdown__header">
        {totalResults === 0 ? (
          <span className="search-dropdown__status-text">
            No search result for <strong>{query}</strong>
          </span>
        ) : (
          <span className="search-dropdown__status-text">
            Showing results for <strong>{query}</strong>
          </span>
        )}
      </div>

      {/* Results Container */}
      <div className="search-dropdown__body">
        {/* Section: Our Fleet */}
        {fleet.length > 0 && (
          <div className="search-dropdown__section">
            <div className="search-dropdown__section-title">Our Fleet</div>
            <div className="search-dropdown__list">
              {fleet.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="search-dropdown__card"
                  onClick={onItemClick}
                >
                  <h4 className="search-dropdown__card-title">{item.title}</h4>
                  <p className="search-dropdown__card-desc">{item.description}</p>
                  <div className="search-dropdown__card-meta">
                    {item.tag && (
                      <span className="search-dropdown__tag">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.05 11.2 2 11.6 2 12v4c0 .6.4 1 1 1h2" />
                          <circle cx="7" cy="17" r="2" />
                          <path d="M9 17h6" />
                          <circle cx="17" cy="17" r="2" />
                        </svg>
                        {item.tag}
                      </span>
                    )}
                    {item.rating && (
                      <span className="search-dropdown__rating">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="#101828"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <strong>{item.rating}</strong>
                        {item.reviewsCount !== undefined && (
                          <span className="search-dropdown__reviews">({item.reviewsCount} reviews)</span>
                        )}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section: Blog */}
        {blog.length > 0 && (
          <div className="search-dropdown__section">
            <div className="search-dropdown__section-title">Blog</div>
            <div className="search-dropdown__list">
              {blog.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="search-dropdown__card"
                  onClick={onItemClick}
                >
                  <h4 className="search-dropdown__card-title">{item.title}</h4>
                  <p className="search-dropdown__card-desc">{item.description}</p>
                  <div className="search-dropdown__card-footer">
                    Blog · {item.date || "Aug 12, 2026"}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section: Company */}
        {company.length > 0 && (
          <div className="search-dropdown__section">
            <div className="search-dropdown__section-title">Company</div>
            <div className="search-dropdown__list">
              {company.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="search-dropdown__card"
                  onClick={onItemClick}
                >
                  <h4 className="search-dropdown__card-title">{item.title}</h4>
                  <p className="search-dropdown__card-desc">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section: FAQs */}
        {faq && faq.length > 0 && (
          <div className="search-dropdown__section">
            <div className="search-dropdown__section-title">Help & FAQs</div>
            <div className="search-dropdown__list">
              {faq.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="search-dropdown__card"
                  onClick={onItemClick}
                >
                  <h4 className="search-dropdown__card-title">{item.title}</h4>
                  <p className="search-dropdown__card-desc">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Section: Legal */}
        {legal.length > 0 && (
          <div className="search-dropdown__section">
            <div className="search-dropdown__section-title">Legal & Policies</div>
            <div className="search-dropdown__list">
              {legal.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="search-dropdown__card"
                  onClick={onItemClick}
                >
                  <h4 className="search-dropdown__card-title">{item.title}</h4>
                  <p className="search-dropdown__card-desc">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
