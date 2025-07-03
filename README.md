# Videoflix — Front‑End

A modern, responsive Netflix‑style streaming UI built with **Angular** (stand‑alone components) and **Video.js**.

> **Goal** Provide the client‑side of Videoflix: user onboarding, authentication and a rich dashboard for browsing and playing adaptive‑quality videos via a REST‑API.

---

\## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture Highlights](#architecture-highlights)
4. [Getting Started](#getting-started)
5. [Available NPM Scripts](#available-npm-scripts)
6. [Code Style & Quality](#code-style--quality)
7. [Accessibility Notes](#accessibility-notes)
8. [Roadmap / Ideas](#roadmap--ideas)
9. [License](#license)

---

\## Features

- **Authentication flow** – register, e‑mail confirmation, login, logout, password reset (request + new password).
- **Protected routes** with a lightweight `AuthGuard` and an HTTP interceptor that injects the `Authorization` header (Token auth).
- **Dashboard**
  - Hero section with autoplay background teaser.
  - Horizontally scrollable genre rows.
  - Modal overlay with a **Video.js** player and manual quality selector (120p – 1080p).
- **Responsive design** – break‑points for mobile ≤360 px up to 4 K screens; touch swipe hints.
- **Modern Angular** 
  - Stand‑alone components & functional providers.
  - Code‑split `email‑verify` route (lazy loaded).
- **Clean code** – every function ≤14 LOC, single responsibility, snake\_case API names, exhaustive typing.

---

\## Tech Stack

| Layer        | Library / Tool                                | Purpose                                                  |
| ------------ | --------------------------------------------- | -------------------------------------------------------- |
| Framework    | **Angular 17**                                | Stand‑alone components, functional guards & interceptors |
| UI / CSS     | **SCSS modules**                              | Component‑scoped styles + global design tokens           |
| Video Player | **Video.js** + `videojs-http-source-selector` | Adaptive quality & consistent controls                   |
| HTTP Client  | Angular `HttpClient`                          | REST‑API communication                                   |
| State / Rx   | RxJS (`tap`, `map`)                           | Side‑effects, stream handling                            |
| Linting      | ESLint (Angular preset)                       | Code quality gate                                        |

---

\## Architecture Highlights

- **Folder‑by‑feature** layout: `pages/`, `services/`, `guards/`, `interceptors/`.
- Pure **services** (`AuthService`, `VideoApi`) hold all HTTP logic; components stay dumb.
- **Interceptor** whitelists open endpoints (signup, login, reset…) before adding the token.
- **Dashboard** disposes and re‑creates the Video.js player on every open to avoid leaks.
- **Global styles** hold design tokens (`--brand`, `--bg`) + scrollbar / autofill overrides.

---

\## Getting Started

```bash
# 1 Clone
$ git clone https://github.com/<your‑org>/videoflix-frontend.git
$ cd videoflix-frontend

# 2 Install
$ npm install

# 3 Environment
# If your backend URL differs, create src/environments/.local.ts and override `apiUrl`.

# 4 Run (dev server on http://localhost:4200)
$ npm start               # alias for ng serve --open
```

> The front‑end expects the Videoflix back‑end at \`\` (default Django port). Adjust the constant in `src/app/services/*` or via an environment file if needed.

\### Building for production

```bash
$ npm run build           # outputs /dist with hashed filenames
```

---

\## Available NPM Scripts

| Script  | Description                                      |
| ------- | ------------------------------------------------ |
| `start` | Dev server with HMR (`ng serve --open`)          |
| `build` | Production build (ahead‑of‑time + optimisations) |
| `lint`  | ESLint check using Angular preset                |
| `test`  | Karma + Jasmine unit tests (placeholder)         |

---

\## Code Style & Quality

- **ESLint** enforces the Angular style guide.
- Commit‑message convention: *feat/fix/chore(scope): short summary*.
- PRs require CI green (lint + unit tests) before merge.

---

\## Accessibility Notes

- All images have meaningful `alt` texts.
- Forms announce errors inline; success/error banners use colour + text.
- ESC closes dialogs; focus is moved into the overlay.
- Further work: add `role="dialog"`, `aria-live="polite"` on toast banners.

---

\## Roadmap / Ideas

- Persist playback progress (localStorage + API endpoint).
- Skeleton loaders while fetching dashboard data.
- Unit tests for guards & interceptors.
- PWA service‑worker + offline splash.


