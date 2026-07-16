# CSE187 Group Project

A full stack e-commerce web app comprised of 4 front facing apps and multiple microservices using Next.js, Node.js, React, MUI, Express, tsoa, GraphQL, and PostgreSQL. Formerly hosted at kitgrail.com on an AWS EC2 instance.

## Contributors
- Dylan Paltiel
- Ethan Vinh
- Aldridge Alegre
- Alexander Skinderev

## Architecture

**KitGrail** is a marketplace for buying and selling sports kits (jerseys), split into 4 front-facing apps (Shopper, Admin, Seller Frontend, plus the Seller Backend API) and 7 backend microservices, mixing REST and GraphQL. Nginx fronts the app on port `3000` and reverse-proxies by path:

| Route | Target |
|---|---|
| `/` | Shopper (Next.js, :3002) |
| `/admin` | Admin (Next.js, :3003) |
| `/sell` | Seller Frontend (static Vite build) |
| `/api/v0/seller/` | Kit_ListingMS (:3011) — seller key & listing management |
| `/api/v0/checkout/` | CheckoutMS (:3014) |
| `/api/v0/history/` | KitHistoryMS (:3016) |
| `/api/v0/` (catch-all) | Seller Backend (:3013) |

Not everything goes through Nginx: Shopper's Next.js server calls several microservices directly over internal HTTP as a backend-for-frontend (AuthService on :3010, ShoppingCartMS and WishlistMS's GraphQL endpoints on :3015/:3012), rather than exposing them to the browser through the gateway.

A single PostgreSQL 16 instance is shared across services, seeded at container startup from each service's own `sql/schema.sql` + `sql/data.sql`.

## Services

| Service | Path | Port | Stack | Responsibility |
|---|---|---|---|---|
| Shopper | `App/Shopper` | 3002 | Next.js, MUI, next-intl (en/es) | Main storefront — browse, search, buy kits; also acts as a BFF calling other services server-side |
| Admin | `App/Admin` | 3003 | Next.js, MUI, Chart.js, next-intl | Internal dashboard — order management, seller moderation, analytics |
| Seller Frontend | `App/Seller/frontend` | 3001 (dev) | Vite, React 19, MUI, i18next, `openapi-typescript` | Seller dashboard SPA — listings, orders, API keys, profile |
| Seller Backend | `App/Seller/backend` | 3013 | Express, tsoa (REST) | Seller account/session/order API |
| AuthService | `App/AuthService` | 3010 | Express, tsoa, Google OAuth, JWT (`jose`) | Central authentication — login, sessions, seller-account verification |
| Kit_ListingMS | `App/Kit_ListingMS` | 3011 | Express, tsoa (REST), bcrypt, JWT, API-key + JWE auth | Kit listing CRUD, plus seller API-key issuance and seller-listing management |
| WishlistMS | `App/WishlistMS` | 3012 | GraphQL (`type-graphql`) | User wishlists |
| ShoppingCartMS | `App/ShoppingCartMS` | 3015 | GraphQL (`type-graphql`) | Shopping cart |
| CheckoutMS | `App/CheckoutMS` | 3014 | Express, tsoa (REST), Stripe | Payment intents, webhooks, order confirmation emails |
| KitHistoryMS | `App/KitHistoryMS` | 3016 | Express, tsoa (REST), pgvector, Gemini API | Retrieval-augmented generation service — scrapes Wikipedia sources, embeds them with Gemini into pgvector, then retrieves + generates kit provenance/history narratives on request |

REST services expose an auto-generated OpenAPI/Swagger spec via `tsoa`; GraphQL services expose a `/graphql` endpoint with GraphiQL. Each service owns its own PostgreSQL schema within the shared database.

### Highlights

- **RAG/LLM pipeline** (KitHistoryMS): Wikipedia scrape → chunk → Gemini embeddings → `pgvector` similarity search → Gemini-generated narrative, end to end.
- **Dual auth schemes**: Google OAuth + JWT for shoppers (AuthService), separate API-key/JWE auth for seller-to-service calls (Kit_ListingMS).
- **Real payments**: Stripe payment intents and webhook handling (CheckoutMS).
- **i18n**: Shopper and Admin support English/Spanish via `next-intl`; the Seller SPA uses `i18next`.
- **Polyglot APIs**: REST (tsoa/OpenAPI) and GraphQL services side by side in the same system.

## Tech Stack

- **Frontend**: Next.js, React, MUI, Vite, i18next / next-intl
- **Backend**: Node.js, Express, tsoa (REST + OpenAPI codegen), GraphQL (`type-graphql`, `graphql-http`)
- **Database**: PostgreSQL 16 with the `pgvector` extension for similarity search
- **Payments**: Stripe
- **Auth**: JWT via `jose`
- **Infrastructure**: Docker, Docker Compose, Nginx (reverse proxy/gateway)
- **Testing**: Vitest, Supertest, Testing Library, MSW, Puppeteer (e2e)
- **Code Quality**: ESLint, `jscpd` (copy-paste detection), coverage thresholds enforced in CI
- **CI/CD**: GitLab CI — `check` (lint + cpd) → `build` → `test` (per-service, against ephemeral Postgres/pgvector)

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Docker and Docker Compose

### Setup

```bash
cd App
npm run installs   # installs dependencies for every service
```

Create an `App/.env` file with these vars:

```
POSTGRES_PORT=5432
POSTGRES_DB=kitgrail
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
SECRET=<32+ byte JWT/JWE signing secret>
GOOGLE_CLIENT_ID=<oauth client id>
GOOGLE_CLIENT_SECRET=<oauth client secret>
STRIPE_SECRET_KEY=<stripe secret key>
STRIPE_WEBHOOK_SECRET=<stripe webhook secret>
GEMINI_API_KEY=<gemini api key, used by KitHistoryMS>
```

### Run everything with Docker

```bash
npm run containerised   # builds all services, then docker compose up
```

Open [http://localhost:3000](http://localhost:3000) — Nginx routes `/` to Shopper, `/admin` to Admin, `/sell` to the Seller frontend, and `/api/v0/*` to the relevant microservice.

### Run services individually

Every service under `App/` has its own `dev`/`build`/`start`/`test` scripts. For example:

```bash
cd App/Shopper && npm run dev
cd App/AuthService && npm run dev
```

## Root-level Scripts (`App/package.json`)

- `npm run installs` — install dependencies across all services
- `npm run build` — build all services
- `npm run containerised` — build and run the full stack via Docker Compose
- `npm run package` — build a linux/amd64 Docker image and save it as a tarball

## Testing

Each service uses Vitest with coverage, plus ESLint and `jscpd` as pretest gates. The GitLab CI pipeline (`.gitlab-ci.yml`) runs `check` → `build` → `test` independently per service, spinning up a scoped Postgres (or `pgvector/pgvector` for KitHistoryMS, since its tests exercise vector similarity search) for integration tests. CheckoutMS has no lint/cpd scripts, so its `check` stage is skipped; `test:shopper` is currently deferred pending a directory casing fix.
