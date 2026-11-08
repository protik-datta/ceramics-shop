# BD Online Ceramics Shop 2.0 — MERN

React + Vite + TypeScript + Tailwind + TanStack Query (client) · Express + Mongoose (server).

```
client/   Public shop (Vercel)
admin/    Admin panel (separate Vercel project)
server/   Express API (Render) + MongoDB Atlas
```

## Local setup
```bash
# API
cd server && cp .env.example .env     # set MONGODB_URI
npm install && npm run seed && npm run dev      # http://localhost:5000

# Client
cd client && cp .env.example .env
npm install && npm run dev                      # http://localhost:5173
```
Seed uses `CLIENT_PUBLIC_URL` to build absolute image URLs (images live in `client/public/products`). Re-run `npm run seed` after changing it.

## API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/products` | all active products |
| GET | `/api/products/:id` | by Mongo id or slug |
| POST | `/api/orders` | `{productId,name,phone,address}`; 201 created, 422 validation, 409 duplicate, 404 product |

Duplicate protection: client sends an `Idempotency-Key` header (same key returns the original order), the submit button is disabled while pending, and the server rejects the same phone + product within 10 minutes. Totals are computed server-side from the product (৳3,500 / ৳350 advance / ৳3,150 remaining).

## Meta Pixel
1. Events Manager → Connect data sources → Web → Meta Pixel → copy the Pixel ID.
2. Set `VITE_META_PIXEL_ID` in `client/.env` (and in Vercel env vars). Empty = tracking off.
3. Events: `PageView` (load + history changes), `ViewContent` (product selected), `InitiateCheckout` (order started, once), `Lead` (only after a successful order, with `eventID`). No name/phone/address is ever sent.
4. Consent: set `VITE_PIXEL_REQUIRE_CONSENT=true` to hold the pixel until your banner calls `setPixelConsent(true)` (`src/lib/analytics.ts`). Do-Not-Track is respected.
Verify with the Meta Pixel Helper extension or Events Manager → Test Events.

## Deploy
- **MongoDB Atlas:** create a cluster, a DB user, allow Render's IPs, copy the connection string.
- **Render (Web Service, root `server`):** build `npm install`, start `npm start`. Env: `MONGODB_URI`, `CLIENT_ORIGIN=https://<your-vercel-domain>` (comma-separate several), `CLIENT_PUBLIC_URL=https://<your-vercel-domain>`, `NODE_ENV=production`. Run `npm run seed` once from the Render shell.
- **Vercel (root `client`):** framework Vite. Env: `VITE_API_URL=https://<render-app>.onrender.com/api`, `VITE_META_PIXEL_ID`, `VITE_SITE_URL`.
- Replace `https://bdceramicsshop.vercel.app` in `index.html`, `robots.txt`, `sitemap.xml` with your real domain.

## Admin panel (`admin/`)
```bash
cd admin && cp .env.example .env     # set VITE_API_URL, VITE_ADMIN_EMAIL, VITE_ADMIN_PASSWORD
npm install && npm run dev           # http://localhost:5174
```
- Login is hardcoded and client-side only: the email/password come from `admin/.env` and the session lives in sessionStorage (5 failed attempts lock the form for 60s).
- **Security warning:** `VITE_*` values are bundled into the built JavaScript, and `/api/admin/*` on the server has no authentication. Anyone who finds the API URL can read or change orders and products. Use only for demos/private networks, or add server-side auth before going live with real customer data.
- Pages: Dashboard (stats + latest orders), Orders (search, status/date filters, pagination, status change, details, delete, CSV export), Products (add/edit, show/hide on site).
- Deploy as a separate Vercel project (root `admin`, framework Vite) with `VITE_API_URL`, `VITE_ADMIN_EMAIL`, `VITE_ADMIN_PASSWORD`. On Render set `ADMIN_ORIGIN=https://<admin-domain>`.
- Product images must be absolute URLs (or `/path` served by the shop).
