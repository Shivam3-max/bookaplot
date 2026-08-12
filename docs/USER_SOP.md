# Mondato — User SOP

Standard operating procedure for the three account roles on the platform: **Channel Partner (CP)**, **Investor**, and **Admin**. Covers registration, login, and what each role can do in their portal.

Last verified against the app: 2026-08-11 (local dev, commit on `main` after the auth/portal/admin rebuild).

---

## 1. Roles at a glance

| Role | Signs up via | Lands on | Purpose |
|---|---|---|---|
| Channel Partner (CP) | `/join` → "Channel Partner" tab | `/portal` | Works an exclusive territory: mandates, leads, creatives, investor asks |
| Investor | `/join` → "Investor" tab | `/portal` | Browses verified deals, posts requirements via Give & Ask |
| Admin | Seeded only (`ADMIN_SEED_PHONE`/`ADMIN_SEED_PASSWORD` in `.env`, via `npx prisma db seed`) | `/admin` | Verifies partners, locks territories, replies to investor asks, manages deals |
| Seller / Owner | `/join` → "Seller / Owner" tab | No account — one-time submission | Lists a property for curation review; does **not** create a login |

There is no self-serve admin signup. The first admin account comes from `.env` (`ADMIN_SEED_PHONE`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME`) via the seed script.

---

## 2. Registration (`/join`)

All three onboarding tabs live on one page: `/join?as=cp`, `/join?as=investor`, `/join?as=seller`.

**Channel Partner** — Name, phone, firm (optional), preferred territory (required), password (min 8 chars, 1 letter + 1 number).
**Investor** — Name, phone, budget band (required), interest (optional), password.
**Seller / Owner** — Name, phone, property detail, expected price (optional). This is a review submission, not an account — no dashboard access follows.

On success, CP/Investor accounts are created with `status: PENDING` and logged in immediately (session cookie set, redirect to `/portal`). Duplicate phone numbers are rejected with *"An account with that phone number already exists. Try signing in instead."*

**Territory selection at signup is a preference, not a grant.** Any CP can pick any territory when registering — the form does not check whether it's already claimed. Exclusivity only takes effect once an admin locks that CP to the territory (§4). The portal now reflects this honestly:
- Not yet verified / verified but not locked → **"Pending lock"**, labelled *Preferred territory*.
- Locked by admin → **"Locked"**, labelled *Exclusive territory*.

*(This distinction was a bug until 2026-08-11 — new signups used to show "Locked" immediately. Fixed in `src/app/portal/page.tsx` and `src/app/portal/territory/page.tsx` by checking `status === "TERRITORY_LOCKED"` instead of just the presence of a territory string.)*

---

## 3. Login (`/login`) and sessions

- Sign in with phone + password. Errors ("no account found" / "incorrect password") render inline; the form does **not** repopulate fields after an error.
- Session is a signed JWT in an httpOnly cookie (`mondato_session`, 7-day expiry), verified in `src/proxy.ts` on every request to `/portal/*`, `/admin/*`, and `/login`.
- Unauthenticated users hitting `/portal` or `/admin` are redirected to `/login`.
- Non-admins hitting `/admin` are redirected to `/`.
- Already-authenticated users hitting `/login` are redirected straight to `/admin` or `/portal` (role-dependent) — you can't view the login page while signed in.
- "Sign out" (in the portal/admin sidebar) clears the cookie and returns to `/`.

---

## 4. Admin workflows (`/admin`)

| Section | What it does |
|---|---|
| **Dashboard** | Network-wide KPIs: mandates, CP/investor counts, pending verifications, funnel. |
| **CPs & Investors** | Two tabs. For each pending member: **Verify** (PENDING → VERIFIED). For a verified CP with a territory set: **Lock Territory** (VERIFIED → TERRITORY_LOCKED) — this is the action that actually grants exclusivity. A locked CP shows **Unlock** to revert to VERIFIED. Locked territories are disabled in other CPs' territory picker. |
| **Give & Ask Desk** | Every investor ask, live. Reply with **Send Revert** (keeps status OPEN/PLATFORM_REVERTED) or **Revert + Mark Matched** (sets status to MATCHED). Replies appear instantly on the investor's own Give & Ask page and on the CP-facing read-only feed. |
| **Deals & Mandates** | Toggle live/featured status per deal, edit pricing/badges. Backed by static deal data (`src/lib/data.ts`, `src/lib/network-data.ts`), not the database. |
| **Leads / CRM, Site Visits, Submissions, Blog/CMS, Analytics, Team & SEO** | Present in the nav but out of scope for this pass — largely static/mock content (e.g. Territory Leads stage changes are explicitly session-only per the page's own copy: *"they sync to the CRM once the backend goes live"*). Treat as UI previews, not live systems, until confirmed otherwise. |

**Verifying a CP or Investor** only changes `PartnerStatus`. It does **not** assign or lock a territory — that's a second, separate action for CPs.

---

## 5. Channel Partner portal (`/portal`)

| Page | What it shows |
|---|---|
| Overview | KPIs (live mandates, territory lock state, territory leads, investor asks) + top mandates + latest investor asks. |
| My Territory | Map + exclusivity card (copy changes based on lock state, see §2) + zone snapshot + request-a-second-territory CTA. |
| Territory Leads | Static demo leads with a stage pipeline (New → Closed Won/Lost). **Not persisted** — refresh loses stage changes. |
| Creatives & Videos | Request a customized cut of a marketing asset ("Customize for Me" → queues a `CreativeRequest` row, 48h SLA copy). Real DB-backed action. |
| Investor Asks | Read-only live feed of every investor ask on the network, with a "Pitch My Inventory" CTA per ask. |

## 6. Investor portal (`/portal`)

| Page | What it shows |
|---|---|
| Overview | KPIs (verified deals, live desperate deals, your asks, budget band) + fresh deals + desperate-deal feed. |
| Verified Deals | Same deal catalogue as CP, investor-framed. |
| Give & Ask | Post a requirement (budget, locations, urgency, note) → creates an `Ask` row and an auto-acknowledgement reply. Every prior ask + all platform reverts show below, live-updating once an admin replies. |
| Deal Videos | Investor framing of the same creatives catalogue. |

---

## 7. Local dev environment

```
DATABASE_URL="mysql://root@127.0.0.1:3306/mondato"   # Laragon MySQL, no password
SESSION_SECRET=...                                     # JWT signing key
ADMIN_SEED_PHONE / ADMIN_SEED_PASSWORD / ADMIN_SEED_NAME
```

- `npm run dev` — starts Next.js on **port 3466** (not 3000).
- `npx prisma migrate dev` — apply schema migrations.
- `npx prisma db seed` — creates the admin account + demo CPs/investors + 2 demo Give & Ask threads. Safe to re-run (upserts by phone), but **only sets `passwordHash` on first creation** — re-seeding won't reset a password you've since changed via the app.
- Demo password for all seeded CPs/investors: `Demo1234`.

### Seeded accounts

| Name | Role | Phone | Status |
|---|---|---|---|
| Mondato Admin | ADMIN | `.env`-defined | — |
| Harjit Dhillon | CP | +91 98761 00310 | Territory Locked (Kharar–Kurali) |
| Neeraj Khanna | CP | +91 98140 00554 | Territory Locked (Zirakpur — VIP Road) |
| Simran Walia | CP | +91 99150 00208 | Verified (territory set, not locked) |
| Rohit Bansal | CP | +91 98550 00871 | Pending |
| Gurdeep Bajwa | Investor | +1 604 000 0118 | Verified |
| Ludhiana Syndicate | Investor | +91 98720 00990 | Verified |

---

## 8. Known issues fixed this pass (2026-08-11)

1. **Investor registration silently failed when "Interest" was left unselected.** The Interest `<select>`'s placeholder option is `disabled`, so browsers omit the field from the submitted form entirely when untouched — Zod's `.optional()` rejects that as `null` (not `undefined`), and the form had no error message wired up for that field, so it just reset with no feedback. Fixed by making the schema accept `null` (`src/app/actions/auth.ts`).
2. **New/unlocked CPs saw "Territory: Locked" immediately.** The portal read territory *lock* state from whether a `territory` string was merely set (a signup preference), instead of the actual `PartnerStatus.TERRITORY_LOCKED` value. Fixed in `src/app/portal/page.tsx` and `src/app/portal/territory/page.tsx`.

Both were verified against seeded + freshly-registered accounts, including a regression check that genuinely locked CPs (Harjit, Neeraj) still display "Locked" correctly.

## 9. Not yet covered

- Full admin sections beyond Dashboard / CPs & Investors / Give & Ask Desk (Leads/CRM, Site Visits, Submissions, Blog/CMS, Analytics, Team & SEO).
- Seller submission review workflow on the admin side.
- Password reset / account recovery (no such flow currently exists in the app).
