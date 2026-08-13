# Implementation Plan - Marketing Pages Global Search (UI & Search Index)

This document outlines the architecture, data strategy, UI workflow, and step-by-step implementation for adding a full-text cross-page search capability across all marketing pages in Drifully (Home, Fleet, Blog, About Us, Contact, Policies, Driver Application, etc.).

---

## 1. Executive Summary & Recommended Approach

**Recommended Approach:** Client-Side Index Search with Fuzzy Matching (`Fuse.js`).

### Why this approach?
* **Zero Latency:** Instant search results as the user types without waiting for server network requests.
* **Cost Effective:** No external search SaaS costs or database load.
* **Privacy & Security:** Runs entirely in the client browser.
* **Ideal Scale:** Perfectly suited for static & dynamic marketing content across dozens/hundreds of pages and articles.

---

## 2. Search Experience & User Flow

When a user searches for a term (e.g. `"light"`):

1. **Trigger:** The user clicks the Search input in the Header/Navbar or presses `Cmd + K` / `Ctrl + K`.
2. **Modal Backdrop:** A fast search overlay modal pops up over the current page.
3. **Real-Time Index Evaluation:** As the user types `"light"`, the search engine scans pre-registered marketing metadata and categories in real time:
   - **Fleet (`/our-fleet`)**: Finds cars with matching keywords (e.g. *"Toyota Yaris - Light City Hatchback"*).
   - **Blog (`/blog`)**: Finds matching articles (e.g. *"5 Tips for Low-Light & Night Driving"*).
   - **Pages (`/about-us`, `/drive-with-drifully`)**: Finds pages discussing light footprint, quick booking, etc.
   - **Legal (`/terms`, `/cancellation`)**: Finds policies mentioning light wear and tear.
4. **Categorized Results:** Results are grouped visually by category (`Fleet`, `Blog`, `Company`, `Legal`) with highlighted keyword matches.
5. **Instant Route:** Selecting a result immediately routes the user to that target page.

---

## 3. Recommended Architecture & Components

```text
components/
  └── search/
      ├── MarketingSearchModal.tsx       # Search modal overlay & keyboard listener (Cmd+K)
      ├── SearchResultCard.tsx           # Individual result item card & category badge
      └── searchData.ts                  # Marketing index registry & data mapper
```

---

## 4. Implementation Steps

### Step 1: Search Data Registry (`components/search/searchData.ts`)
* Define standard `SearchableItem` interface:
  - `id`: Unique string
  - `title`: Page / post / car title
  - `url`: Path route (e.g. `/our-fleet/toyota-yaris`)
  - `category`: `'Fleet' | 'Blog' | 'Company' | 'Legal'`
  - `description`: Excerpt or summary text
  - `keywords`: Array of search tags
* Combine static route entries + dynamic records from `data/vehicles.ts` and blog articles.

### Step 2: Client-Side Fuzzy Search Logic
* Install `fuse.js` (or lightweight equivalent).
* Configure search key weights:
  - Title: weight `0.5`
  - Keywords: weight `0.3`
  - Description: weight `0.2`

### Step 3: UI Components & Keyboard Shortcuts
* Create `MarketingSearchModal.tsx`:
  - Backdrop overlay with blur.
  - Global `keydown` listener for `Cmd + K` / `Ctrl + K` and `Escape`.
  - Up / Down arrow key selection support + `Enter` key navigation.
  - Categorized result listing with empty state ("No results found for '...'").
* Add Search trigger button to `components/Navbar.tsx`.

---

## 5. Verification Plan

* [ ] **Keyboard Shortcut:** Verify `Cmd + K` / `Ctrl + K` opens and `Esc` closes the search modal.
* [ ] **Cross-Page Results:** Test queries across categories (e.g. "Toyota", "Night", "Cancellation", "Driver").
* [ ] **Navigation:** Verify selecting any result navigates to the target page and closes the modal.
* [ ] **Responsiveness:** Test search modal layout on mobile, tablet, and desktop screens.
