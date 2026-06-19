# BusyBrains Tech-Hub Corporate Services

Consultation intake platform: public site with a multi-category service form,
and a staff dashboard for managing incoming cases.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (DB + Auth) · Resend (email)

## Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev
```

## Environment variables (`.env.local`)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret — server only) |
| `RESEND_API_KEY` | resend.com → API Keys (secret) |
| `RESEND_FROM_EMAIL` | A verified sender, e.g. `cases@busybrainstechhub.com`. Use `onboarding@resend.dev` until your domain is verified. |
| `STAFF_NOTIFICATION_EMAILS` | Comma-separated: `you@example.com,admin@example.com` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL, used in email links |

## Database setup

1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql` in full.
3. Go to **Authentication → Users** and manually create two users (you + admin) with email/password — this is intentional, there's no public signup.
4. Copy each user's UUID (click into the user) and run in the SQL Editor:
   ```sql
   insert into staff_profiles (id, display_name, role) values
     ('your-uuid-here', 'Tobi', 'owner'),
     ('admin-uuid-here', 'Admin Name', 'admin');
   ```

## Deploying (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all the environment variables above in Vercel → Project → Settings → Environment Variables.
4. Deploy.

## How it works

- **Public site**: Home, Services (all 10 categories), About, Contact, and the **Get Started** case form.
- **Case form**: 3-step flow — pick category & request type, describe the issue, give contact details. On submit, a reference code (`REQ-CYB-0042`) is generated server-side and emailed to the client + staff.
- **Dashboard** (`/dashboard`): staff-only, requires login. Lists all cases, filterable by status, with a detail panel to update status through New → In review → In progress → Completed.
- **Security**: the public form can only INSERT into the database (enforced by Postgres Row Level Security), never read. Only authenticated staff can view or update cases. The Resend API key and Supabase service role key are server-only and never reach the browser.

## Notes for whoever maintains this

- Service categories live in `lib/services.ts` — edit names/items there, no DB migration needed for copy changes.
- Reference code prefixes (CYB, AIA, etc.) and the per-category counters live in the database (`supabase/schema.sql`).
- Update the placeholder email/phone in `app/contact/page.tsx` before launch.
