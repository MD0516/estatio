# Estatio

A full-stack real estate property listing and discovery platform built with **Next.js**, **Express**, **PostgreSQL**, and **Prisma**.

Estatio connects property **seekers** (people looking for a home) with property **owners** (people listing a home). Seekers can browse, search, filter, wishlist, and review properties or send inquiries directly to owners. Owners can create and manage their own listings and respond to inquiries.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
  - [4. Verify everything is running](#4-verify-everything-is-running)
- [Environment Variables](#environment-variables)
- [Demo / Test Credentials](#demo--test-credentials)
- [NPM Scripts Reference](#npm-scripts-reference)
- [API Overview](#api-overview)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Database Schema Overview](#database-schema-overview)
- [Security](#security)
- [Known Limitations / Not Implemented](#known-limitations--not-implemented)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Authentication** — Register/login with hashed passwords (bcrypt), JWT stored in HttpOnly cookies
- **Property management** — Create, edit, soft-delete listings with multiple images
- **Advanced search & filtering** — By city, property type, listing type, price, amenities
- **Wishlist** — Save/unsave properties for later
- **Inquiries** — Seekers can message owners directly about a property; owners can update inquiry status
- **Reviews** — 1–5 star reviews with a "helpful" voting system
- **Role-based access** — A user starts as a `seeker`; creating a property automatically upgrades them to `owner`
- **Auto-generated API docs** — Swagger/OpenAPI 3.0 UI

---

## Tech Stack

**Frontend**
| Tech | Version | Purpose |
|---|---|---|
| Next.js | 16.x | App Router, routing, SSR |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Sass/SCSS | 1.101.x | Theming |
| TanStack React Query | 5.x | Server state, caching |
| Axios | 1.18.x | HTTP client |
| Sonner | 2.x | Toast notifications |

**Backend**
| Tech | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | HTTP server |
| TypeScript | 7.x | Type safety |
| Prisma ORM | 7.x | Database access & migrations |
| PostgreSQL | 12+ | Database |
| JWT (`jsonwebtoken`) | 9.x | Auth tokens |
| bcrypt | 6.x | Password hashing |
| Zod | 4.x | Request validation |
| Multer | 2.x | Image upload handling |
| express-rate-limit | 8.x | Rate limiting (inquiries) |
| swagger-jsdoc / swagger-ui-express | — | API documentation |

---

## Project Structure

```
estatio/
├── frontend/                     # Next.js 16 web app
│   ├── src/
│   │   ├── app/                  # App Router
│   │   │   ├── (auth)/           # Guest-only: login, register
│   │   │   └── (main)/           # Home, properties, profile
│   │   ├── components/           # Reusable React components
│   │   ├── context/              # AppContext — global auth/UI state
│   │   ├── hooks/                # React Query hooks (useProperty, useWishlist, ...)
│   │   ├── lib/                  # axios config, query keys, api/ clients
│   │   └── types/                # Shared TypeScript types
│   └── .env.example
│
└── backend/                      # Express REST API
    ├── src/
    │   ├── modules/               # auth, property, wishlist, inquiry, review
    │   │   └── <module>/
    │   │       ├── *.controller.ts
    │   │       ├── *.service.ts
    │   │       ├── *.schema.ts    # Zod validation
    │   │       └── *.route.ts     # Express router + Swagger docs
    │   ├── middleware/            # auth, validate, error, log, upload, rateLimit
    │   ├── config/                # swagger.ts
    │   └── server.ts              # App entry point
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.ts
    │   └── seeds/                 # user.seed.ts, properties.seed.ts
    └── .env.example
```

Each backend module follows a **Controller → Service → Database** pattern for a clean separation of concerns.

---

## Architecture

```
Browser (Next.js/React)
        │  Axios (withCredentials: true)
        ▼
Express API (routes → controllers → services)
        │  Prisma ORM
        ▼
PostgreSQL Database
```

- Auth is **cookie-based**: on login/register, the backend sets an HttpOnly `sessionCookie` containing a signed JWT.
- The frontend never touches the token directly — every request just needs `withCredentials: true`.

---

## Prerequisites

Make sure you have these installed before you start:

- **Node.js 18+**
- **PostgreSQL 12+** (running locally, or accessible via connection string)
- **npm** (or yarn)

---

## Setup Guide

### 1. Clone the repository

```bash
git clone <repository-url>
cd estatio
```

### 2. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create your env file from the template
cp .env.example .env
```

Edit `backend/.env` with your own values (see [Environment Variables](#environment-variables) below):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/estatio
JWT_SECRET=your_secret_key
NODE_ENV=local
APP_URL=http://localhost:4040
PORT=4040
```

Create the database (skip if it already exists):

```bash
createdb estatio
# or create it manually via pgAdmin / psql
```

Run migrations, generate the Prisma client, then seed demo data:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Start the dev server:

```bash
npm run dev
```

The backend runs at **http://localhost:4040**, with Swagger docs at **http://localhost:4040/api-docs**.

### 3. Frontend setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install dependencies
npm install

# Create your env file from the template
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4040
```

Start the dev server:

```bash
npm run dev
```

The frontend runs at **http://localhost:3000**.

### 4. Verify everything is running

1. Open `http://localhost:3000` in your browser.
2. Log in with the [demo credentials](#demo--test-credentials) below.
3. You should see ~50 seeded properties across several Tamil Nadu cities.
4. Optionally, open `http://localhost:4040/api-docs` to explore the API directly.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/estatio` |
| `JWT_SECRET` | Secret used to sign JWTs | any long random string |
| `NODE_ENV` | Environment mode | `local` or `production` |
| `APP_URL` | Backend base URL (used by Swagger) | `http://localhost:4040` |
| `PORT` | Server port (optional) | `4040` |

### Frontend (`frontend/.env.local`)

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL the frontend calls | `http://localhost:4040` |

> `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to browser-side code.

---

## Demo / Test Credentials

The seed script creates one demo **owner** account:

| Field | Value |
|---|---|
| Email | `owner@estatio.dev` |
| Password | `Password123!` |
| Role | `owner` |

This account already owns several of the ~50 seeded properties, so you can immediately explore both the seeker and owner flows (e.g. edit a listing, view/respond to inquiries).

> Note: These are development-only credentials, not meant for production use.

---

## NPM Scripts Reference

### Backend (`backend/`)

**npm scripts**

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx watch src/server.ts` | Start dev server with hot reload |

**Prisma CLI commands** (run from `backend/`)

| Command | Purpose |
|---|---|
| `npx prisma migrate dev` | Run/create migrations |
| `npx prisma generate` | Regenerate the Prisma client after a schema/migration change |
| `npx prisma db seed` | Seed the database with demo data (runs `tsx prisma/seed.ts`) |
| `npx prisma migrate reset` | Drop, recreate, and re-migrate the DB |

### Frontend (`frontend/`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `next dev` | Start dev server (http://localhost:3000) |
| `npm run build` | `next build` | Production build |
| `npm run start` | `next start` | Run the production build |

### Re-seeding from scratch

```bash
cd backend
npx prisma migrate reset   # drops and recreates the DB
npx prisma migrate dev     # re-applies migrations
npx prisma generate        # regenerates the Prisma client
npx prisma db seed         # re-seeds demo data
```

---

## API Overview

Base URL: `http://localhost:4040/api`

| Module | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| Auth | POST | `/auth/register` | No | Register a new user |
| Auth | POST | `/auth/login` | No | Log in |
| Auth | GET | `/auth/profile` | Yes | Get current user profile |
| Auth | POST | `/auth/logout` | Yes | Log out |
| Property | GET | `/property` | No | List all active properties |
| Property | GET | `/property/:id` | No | Get one property |
| Property | POST | `/property/upload-imgs` | Yes | Upload property images |
| Property | POST | `/property` | Yes | Create a listing |
| Property | PATCH | `/property/:id` | Yes | Update a listing (owner only) |
| Property | DELETE | `/property/:id` | Yes | Soft-delete a listing (owner only) |
| Property | PATCH | `/property/image/:propertyId` | Yes | Reorder/update images |
| Property | DELETE | `/property/image/:imageId` | Yes | Delete a single image |
| Property | POST | `/property/search` | No | Search with filters |
| Property | GET | `/property/:propertyId/similar` | No | Get similar properties |
| Wishlist | POST | `/wishlist` | Yes | Toggle wishlist (add/remove) |
| Wishlist | GET | `/wishlist` | Yes | Get user's wishlist |
| Inquiry | POST | `/inquiry` | Yes (5/15min) | Send an inquiry |
| Inquiry | PATCH | `/inquiry/:id` | Yes | Update inquiry status (owner only) |
| Inquiry | GET | `/inquiry` | Yes | List sent + received inquiries |
| Review | POST | `/review` | Yes | Post a review |
| Review | GET | `/review/property/:id` | No | Get reviews for a property |
| Review | POST | `/review/:id/helpful` | Yes | Toggle "helpful" vote |
| Health | GET | `/health` | No | Health check |

Full request/response schemas are available in Swagger (see below).

---

## API Documentation (Swagger)

1. Start the backend: `cd backend && npm run dev`
2. Open **http://localhost:4040/api-docs**
3. Log in via `POST /auth/login` first — the auth cookie is then used automatically for "Try it out" requests on protected endpoints.

---

## Database Schema Overview

Core Prisma models:

| Model | Purpose |
|---|---|
| `User` | Seeker/owner accounts |
| `Property` | Core listing (city, price, type, listing type) |
| `PropertyDetails` | Bedrooms, bathrooms, area, floor, furnishing, parking, facing |
| `PropertyImage` | Image URL, display order, cover flag |
| `Wishlist` | User ↔ Property saves |
| `Inquiry` | Seeker → Owner messages with status tracking |
| `Review` | 1–5 star ratings with helpful-vote count |

Seeded data includes ~50 properties across Chennai, Coimbatore, Madurai, Trichy, Salem, Erode, Tirupur, and Vellore, each with 3 placeholder images and randomized details.

---

## Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT (HS256, 1-day expiry) stored in an **HttpOnly** cookie — not accessible from JS
- `secure` and `sameSite` cookie flags adapt automatically based on `NODE_ENV`
- All input validated with **Zod** schemas
- **Prisma ORM** parameterizes all queries (SQL-injection safe)
- Ownership checks on property edits/deletes and inquiry status updates
- Rate limiting: 5 inquiries per 15 minutes per user/IP
- CORS locked to `http://localhost:3000` in development

---

## Known Limitations / Not Implemented

- No automated tests (unit/integration) yet
- No email verification or password reset flow
- No two-factor authentication
- No chat/messaging system (inquiries are one-way, threaded by status only)
- No payment integration
- Logging is via `console.log`, not a structured logger

---

## Troubleshooting

| Issue | Likely Fix |
|---|---|
| `ECONNREFUSED` connecting to Postgres | Confirm PostgreSQL is running and `DATABASE_URL` is correct |
| Frontend can't reach backend / CORS error | Confirm backend is on port `4040` and `NEXT_PUBLIC_API_URL` matches |
| 401 on every request | Make sure cookies are enabled and you're logged in; check `JWT_SECRET` is set |
| Seed script fails | Run `npx prisma migrate reset`, then `npx prisma generate`, then `npx prisma db seed` again |
| Prisma types out of sync / import errors from `@prisma/client` | Run `npx prisma generate` |
| Images not loading | Confirm `backend/uploads/properties/` exists and backend static serving is active |

---

**Ports summary**

| Service | Port |
|---|---|
| Frontend | 3000 |
| Backend API | 4040 |
| Swagger UI | 4040/api-docs |
| PostgreSQL | 5432 |