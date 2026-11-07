# GRANTLY — Scholarship World

> **Rethinking the scholarship experience.** Find it. Match it. Apply. Track it.

GRANTLY is a unified scholarship discovery and management platform. Students can discover opportunities, see how well each one fits their profile, understand what is required, and manage every application from a single place, all inside an interactive, colourful 3D world.

Built for **THE OUTPOST – Round 1: The Frontend Mission** (Frontend Arena), a 6-hour individual frontend hackathon.

| | |
|---|---|
| **Live demo** | `<add your Netlify / Vercel link>` |
| **Source code** | `<add your GitHub repository link>` |
| **Author** | `<your name>` |

---

## Table of contents

1. [The problem](#1-the-problem)
2. [Our solution](#2-our-solution)
3. [Features](#3-features)
4. [Pages and routes](#4-pages-and-routes)
5. [3D worlds](#5-3d-worlds)
6. [Multi-language support](#6-multi-language-support)
7. [How the match score works](#7-how-the-match-score-works)
8. [Tech stack](#8-tech-stack)
9. [Project structure](#9-project-structure)
10. [Getting started](#10-getting-started)
11. [Deployment](#11-deployment)
12. [Design decisions](#12-design-decisions)
13. [Accessibility and responsiveness](#13-accessibility-and-responsiveness)
14. [Performance notes](#14-performance-notes)
15. [Mapping to the evaluation criteria](#15-mapping-to-the-evaluation-criteria)
16. [Known limitations and future work](#16-known-limitations-and-future-work)
17. [Quality, security and testing](#17-quality-security-and-testing)

---

## 1. The problem

Accessing educational financial assistance is hard. Students struggle to:

- **Find** relevant scholarships among hundreds of sources
- **Understand** whether they are actually eligible
- **Navigate** different application processes and document requirements
- **Keep track** of deadlines and the status of each application

The challenge: *transform a complex experience into a seamless digital journey.*

## 2. Our solution

GRANTLY turns the scholarship journey into four simple steps, each with its own screen:

```
Discover  →  Understand  →  Apply  →  Track
(search,     (match score,    (steps &    (kanban board,
 filter)      eligibility)     documents)  deadlines)
```

A short **profile** (level, field, country, GPA, family income) powers everything. Every scholarship instantly shows a **match percentage** and a clear **eligibility checklist**, so students know where they stand before spending time on an application.

To make the experience engaging, the app is wrapped in a low-poly 3D world with a game-like HUD (coins, clock, deadline reminder), and it is available in six languages.

## 3. Features

### Discover
- Full-text search across scholarship name, provider and description
- Filters: **level**, **field**, **country**
- Sorting: **best match**, **highest amount**, **soonest deadline**
- Empty-state message when no results match

### Understand
- Match percentage on every card (ring indicator)
- Scholarship detail page with description, amount, deadline, provider
- **Eligibility checklist**: level, field, country, minimum GPA, income limit, each marked as met or not met
- "How to apply" steps and the full list of required documents

### Apply and track
- Save or remove any scholarship with one click
- **Start application** moves it straight into the tracker
- **Kanban tracker** with five columns: Saved, In progress, Submitted, Awarded, Rejected
  - Drag and drop cards between columns
  - Keyboard-friendly "Move to" dropdown on every card
  - Per-application **document checklist** with a progress bar
  - Remove an application at any time

### Deadlines
- Dashboard widget with the next deadlines
- Dedicated **timeline** page sorted by date, colour-coded by urgency:
  - Red: 7 days or fewer
  - Amber: 8 to 21 days
  - Green: more than 21 days
- Items already in your tracker are tagged
- A floating **deadline nudge** card (bottom-left, desktop) highlights the most urgent tracked scholarship

### Dashboard
- Welcome message with the student's name
- Live stats: saved, applied, due this week, coins
- Top 3 matches for the current profile
- Upcoming deadlines list

### Gamification
- Students start with **100 coins** and earn more as they progress:

  | Action | Coins |
  |---|---|
  | Save a scholarship | +5 |
  | Start an application | +20 |
  | Mark as submitted | +50 |
  | Mark as awarded | +200 |

  Each reward is given **once per scholarship per stage**, so it cannot be farmed by toggling.

### Profile
- Edit name, level, field, country, GPA and family income
- Saving the profile instantly recalculates all match scores

### Persistence
- Everything (profile, saved applications, document checklists, coins, language) is stored in `localStorage` and survives refreshes. No backend is needed.

## 4. Pages and routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Overview, stats, top matches, upcoming deadlines |
| `/discover` | Discover | Search, filter and sort all scholarships |
| `/s/:id` | Scholarship detail | Eligibility, steps, documents, save and start |
| `/tracker` | Tracker | Kanban board of your applications |
| `/deadlines` | Deadlines | Colour-coded timeline of all deadlines |
| `/profile` | Profile | Details that drive the match score |

Unknown routes fall back to the dashboard.

## 5. 3D worlds

Each area of the app has its own 3D background, built with three.js and react-three-fiber. All scenes use flat-shaded low-poly materials, slow camera orbit and gentle mouse parallax.

| Theme | Used on | What you see |
|---|---|---|
| **City** | Dashboard, Deadlines | Low-poly scholarship city: coloured buildings, roads, trees, lamp posts, a fountain and a giant spinning gold coin, with floating coins above |
| **Cosmos** | Discover, Detail, Profile | Starfield, colourful distorted neon shapes, a ringed planet and a floating coin |
| **Sunset** | Tracker | Layered purple/orange hills, a setting sun, floating clouds and coins |

Scenes are generated procedurally with a seeded random function, so the layout is stable between visits. The 3D module is **lazy-loaded** so the UI appears immediately while the world loads.

## 6. Multi-language support

Six languages, switchable from the header at any time and remembered for the next visit:

| Code | Language |
|---|---|
| `en` | English |
| `hi` | हिन्दी (Hindi) |
| `ta` | தமிழ் (Tamil) |
| `es` | Español (Spanish) |
| `fr` | Français (French) |
| `ar` | العربية (Arabic, **right-to-left**) |

- All interface text comes from a single dictionary in `src/lib/i18n.ts`. Adding a language means adding one value per key.
- Arabic switches the whole layout to RTL (`dir="rtl"`) using CSS logical properties.
- Dates and the clock use the selected locale.
- Noto Sans fonts for Devanagari, Tamil and Arabic are loaded so these scripts render correctly.
- Scholarship names, providers and descriptions are mock data and stay in English.

## 7. How the match score works

The match score (0 to 100%) is computed in `src/lib/match.ts` by comparing the student's profile with each scholarship:

| Check | Rule | Weight |
|---|---|---|
| Level | Profile level equals scholarship level | 30 |
| Field | Scholarship field is "Any" or equals profile field | 25 |
| Country | Scholarship country is "Global" or equals profile country | 15 |
| GPA | Profile GPA is at least the minimum GPA | 15 |
| Income | Profile income is at most the income limit | 15 |

The same five checks drive the eligibility checklist on the detail page, so the percentage is always explainable.

## 8. Tech stack

| Area | Technology |
|---|---|
| Framework | React 19 with TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 plus a small set of custom component classes |
| Animation | Framer Motion (page transitions, reduced-motion detection) |
| 3D | three.js, `@react-three/fiber`, `@react-three/drei` |
| State | Zustand with the `persist` middleware (localStorage) |
| Routing | React Router |
| Icons | lucide-react |
| Fonts | Silkscreen (pixel headings), Space Grotesk (body), Noto Sans for Hindi, Tamil and Arabic |

## 9. Project structure

```
grantly/
├── public/
│   └── _redirects            # Netlify SPA fallback
├── vercel.json               # Vercel SPA fallback
├── index.html                # Fonts and meta tags
└── src/
    ├── main.tsx              # Entry point, router
    ├── App.tsx               # Route table
    ├── index.css             # Tailwind theme + component classes
    ├── types.ts              # Shared TypeScript types
    ├── scene/
    │   └── World.tsx         # City, Cosmos and Sunset 3D scenes
    ├── components/
    │   ├── Layout.tsx        # Header, nav, language picker, 3D background
    │   ├── Nudge.tsx         # Floating deadline reminder
    │   └── ui.tsx            # Ring, DaysBadge, ScholarshipCard, DeadlineRow
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── Discover.tsx
    │   ├── Detail.tsx
    │   ├── Tracker.tsx
    │   ├── Deadlines.tsx
    │   └── Profile.tsx
    ├── store/
    │   └── useStore.ts       # Persisted global state and actions
    ├── lib/
    │   ├── i18n.ts           # Dictionary, language list, useT() hook
    │   └── match.ts          # Match score, eligibility checks, formatters
    └── data/
        └── scholarships.ts   # 16 mock scholarships
```

### State shape (Zustand, persisted as `grantly-store`)

```ts
{
  lang: 'en' | 'hi' | 'ta' | 'es' | 'fr' | 'ar'
  profile: { name, level, field, country, gpa, income }
  apps: { [scholarshipId]: { status, checked: string[] } }
  coins: number
  earned: string[]   // "id:status" keys so rewards are given once
}
```

## 10. Getting started

### Prerequisites
- Node.js 20 or newer
- npm (comes with Node.js)

### Install and run
```bash
git clone <your-repo-url>
cd grantly
npm install
npm run dev
```
Open the printed address, usually `http://localhost:5173`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Run the test suite in watch mode |
| `npm run test:run` | Run the test suite once (CI) |
| `npm run test:coverage` | Run tests with a coverage report |
| `npm run lint` | Lint with ESLint (typescript-eslint, react-hooks) |
| `npm run typecheck` | Type-check with `tsc` |

> The 3D library is a large chunk. It is lazy-loaded and only mounted after the first paint, so it does not block the first render.

## 11. Deployment

The project is a static single-page app. Both SPA fallbacks are included so refreshing on `/tracker` or any other route works.

### Netlify (CLI)
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy               # draft deploy, publish directory: dist
netlify deploy --prod --dir=dist
```

### Netlify or Vercel (Git-based)
1. Push the repository to GitHub.
2. Import it in Netlify or Vercel.
3. Build command: `npm run build`. Output directory: `dist`.
4. Every push to `main` redeploys automatically.

## 12. Design decisions

- **Game-like world, serious content.** The pixel font, chunky white pill buttons and HUD (coins, clock, floating reminder card) make a stressful process feel approachable, while the content panels stay clean and readable.
- **Light panels over a dark, busy background.** All text sits on near-opaque white panels so contrast stays high regardless of what the 3D scene is doing.
- **One theme per journey stage.** The city (overview), cosmos (exploration) and sunset (tracking and progress) give each stage a distinct mood and make navigation feel like moving between places.
- **Explainable matching.** A single percentage is not enough, so the same rules are shown as a met or not-met checklist.
- **Mock deadlines are relative to today.** Each scholarship stores "days from now", so the demo always has realistic upcoming deadlines whenever it is opened.
- **No backend.** Mock data plus localStorage keeps the app fast, offline-friendly and easy to evaluate.

## 13. Accessibility and responsiveness

**Accessibility**
- Semantic landmarks (`header`, `nav`, `main`, `aside`, `section`, `article`) and a logical heading order
- Visible keyboard focus ring on all interactive elements
- Every drag-and-drop action has a keyboard alternative (the "Move to" select)
- ARIA labels on the match ring, progress bars, the language picker and the coins counter
- Decorative icons and the 3D canvas are hidden from assistive tech (`aria-hidden`)
- Form fields have associated labels; toggle buttons use `aria-pressed`
- `prefers-reduced-motion` is respected: CSS transitions are disabled and the 3D camera stops orbiting
- Correct `lang` and `dir` attributes are set for the selected language

**Responsiveness**
- Mobile-first layout verified for phone, tablet and desktop widths
- Navigation scrolls horizontally on small screens
- Card grids go from 1 to 2 to 3 columns; the Kanban board goes from 1 to 2 to 5 columns
- The floating nudge card is hidden on small screens to avoid clutter

## 14. Performance notes

- The 3D scene is code-split with `React.lazy`, with a plain dark fallback while it loads
- Pixel ratio is capped at 1.5 to protect low-end GPUs
- Scene geometry is generated once with `useMemo`
- Match scores and filtered lists are memoised
- With reduced motion enabled, the canvas renders on demand instead of every frame

## 15. Mapping to the evaluation criteria

| Criterion | How GRANTLY addresses it |
|---|---|
| **UI/UX design and visual quality** | Consistent pixel-style design system, clear hierarchy, high-contrast panels, themed 3D scenes |
| **Functionality** | Search, filters, sorting, match scoring, save, apply, kanban with drag and drop, document checklists, deadlines, profile, persistence |
| **Creativity and innovation** | Three procedural 3D worlds, game-style coins and HUD, explainable match score, 6 languages with RTL |
| **Problem statement alignment** | Covers the full journey: discover, understand, apply, track |
| **Code quality and technical implementation** | Typed with TypeScript, feature-based folders, small focused components, central store, single i18n dictionary, pure helper functions |
| **Responsiveness and accessibility** | See section 13 |

## 16. Known limitations and future work

- Scholarship data is mock data (16 entries); a real version would load from an API or a CMS
- Scholarship content (names, descriptions, steps) is not translated; only the interface is
- Deadlines are mock offsets and are not synced to a calendar
- Planned ideas: calendar export (.ics), email reminders, an essay and document vault, shareable shortlists, and a recommendation engine that learns from saved scholarships

---

## 17. Quality, security and testing

### Clean architecture
- Feature-oriented folders: `pages`, `components`, `store`, `lib` (pure logic), `data`, `scene`
- Business logic (match scoring, sanitization, i18n) lives in pure, tested functions in `src/lib`, not inside components
- Shared `Select` component, one global store, one translation dictionary; no duplicated logic
- Strict TypeScript, ESLint (typescript-eslint, react-hooks rules) with zero errors
- Route-level code splitting with `React.lazy`

### Security and data sanitization
- All user input is sanitized with `sanitizeText` (strips HTML tags, `<` `>`, control characters; collapses whitespace; enforces max length) and numbers are clamped (`GPA 0-4`, income range)
- **localStorage is treated as untrusted**: on load the persisted state is validated (language whitelist, profile values checked against allowed lists, only known scholarship IDs, valid statuses and known document names, bounded coins). Tampered data falls back to safe defaults
- React escapes all rendered text; no `dangerouslySetInnerHTML`, `eval` or inline scripts anywhere
- Security headers for both hosts (`netlify.toml`, `vercel.json`): strict **Content-Security-Policy**, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`
- No secrets, API keys or third-party tracking; the only external requests are Google Fonts

### Runtime efficiency and Core Web Vitals
- The page paints instantly with a CSS gradient; the 3D canvas mounts after first paint (better **LCP** and **INP**)
- 3D is lazy-loaded in its own chunk and uses a lighter setup on small screens (lower pixel ratio, no antialiasing, fewer stars, low-power GPU hint)
- Reduced motion switches the canvas to on-demand rendering
- `font-display: swap`, preconnect to font hosts, immutable caching for hashed assets
- Memoised filtering and scoring; scene geometry generated once
- Minimal layout shift: fixed-size components and no late-loading images
- If WebGL fails or is unavailable, an error boundary keeps the app fully usable with the gradient background

### Component testing and reliability
- **39 automated tests** with Vitest, React Testing Library, user-event and jsdom
  - Unit: match scoring, sanitization, clamping, tamper-proof persistence, translation completeness (all 6 languages for every key), store rewards (no coin farming)
  - Component and integration: dashboard, discover (search, filter, sort, empty state, XSS input), detail (eligibility, start application, not found), tracker (move, document checklist, remove), deadlines, profile (sanitize and clamp), layout (skip link, current page, title, language and RTL switch)
  - **Accessibility tests with axe-core** on every page
  - Error boundary behaviour
- Error boundaries wrap both the 3D scene and the page content

### Accessibility (ARIA and keyboard)
- Skip-to-content link, `main` receives focus on every route change, and the document title updates per page
- Landmarks, labelled navigation, `aria-current="page"` on the active link
- Every form control has a programmatic label; status messages use `role="status"` / `aria-live`
- Drag-and-drop has a full keyboard alternative ("Move to" select)
- Visible focus ring everywhere; decorative icons and the canvas are `aria-hidden`
- Translated ARIA labels (met / not met, match score, progress bars), correct `lang` and `dir` for Arabic
- Reduced-motion preference respected

---

*Built in 6 hours for THE OUTPOST by Frontend Arena.*
