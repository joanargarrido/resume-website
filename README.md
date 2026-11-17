# Resume site

A single-page resume with a private admin area for editing everything without touching code.

- **Public page** (`/`): photo, name, date of birth (display mode is configurable), city, bio, LinkedIn/GitHub, experience, education, skills, contact form and a downloadable CV.
- **Admin** (`/admin`): login, profile (photo, CV, DOB format), experience, education and skills (create, edit, delete, reorder), and an inbox for contact messages.
- **Stack**: Next.js (App Router, Cache Components), TypeScript, Tailwind CSS v4, Supabase (Postgres, Auth, Storage), Resend, Vitest + React Testing Library.

## Setup

1. `npm install`
2. Create a free [Supabase](https://supabase.com) project.
3. Run the SQL in `supabase/migrations/20260101000000_init.sql` in the SQL editor (or `supabase db push` with the CLI). Optionally run `supabase/seed.sql` for example content.
4. Supabase dashboard → Authentication:
   - Turn **off** "Allow new users to sign up".
   - Add your user (Users → Add user, with email and password).
5. Make that user an admin, in the SQL editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
6. Copy `.env.example` to `.env.local` and fill it in (Supabase URL and keys from Project settings → API). `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser or committed.
7. Contact emails: create a [Resend](https://resend.com) account. Use `onboarding@resend.dev` as sender while testing, then verify your domain.
8. `npm run dev`, open <http://localhost:3000> and sign in at <http://localhost:3000/admin/login>.

### Environment variables

| Variable                        | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (RLS protects the data)                 |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only; used by the contact form to save messages  |
| `RESEND_API_KEY`                | Resend API key                                          |
| `CONTACT_TO_EMAIL`              | Where contact messages are emailed                      |
| `CONTACT_FROM_EMAIL`            | Sender address, e.g. `Resume Site <you@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL`          | Public site URL (sitemap, Open Graph)                   |

## Scripts

| Command                | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the dev server                       |
| `npm run build`        | Production build                           |
| `npm run typecheck`    | Generate route types and run `tsc`         |
| `npm run lint`         | ESLint                                     |
| `npm run format:check` | Prettier check (`npm run format` to fix)   |
| `npm test`             | Unit tests (`test:watch`, `test:coverage`) |

A husky pre-commit hook runs Prettier and ESLint on staged files. CI (`.github/workflows/ci.yml`) runs typecheck, lint, format check, tests with coverage and a build.

## How it works

- The public page reads through one cached query bundle (`src/lib/data/getResume.ts`, tag `resume`). Every admin save calls `updateTag("resume")` and `revalidatePath("/")`, so changes appear immediately while the page stays static and fast.
- Security is layered: `src/proxy.ts` redirects signed-out visitors away from `/admin`, the admin layout re-checks the session, and **every Server Action calls `requireAdmin()`**. Row Level Security in Postgres and Storage is the final guard: content is publicly readable but only rows in `admins` can write. `contact_messages` has no public access at all; inserts use the service-role key on the server.
- Photo and CV uploads go straight from the browser to the `public-assets` bucket (RLS allows only admins to write), which avoids the Server Action body-size limit.
- The contact form has a honeypot field and a per-IP limit (3 per 10 minutes, hashed IPs in `contact_rate_limits`). The message is saved first; if Resend fails, it is still in the admin inbox.
- `src/types/database.ts` mirrors the migration by hand. Regenerate it with `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

## Deploy (GitHub + Vercel)

1. Create a GitHub repository and push this project.
2. In Vercel, import the repository and add all variables from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to the production URL).
3. In Supabase → Authentication → URL configuration, set the Site URL and add `https://your-domain/auth/callback` as a redirect URL.
4. Deploy, then repeat the checks below on the live URL.

## Manual verification checklist

- `/admin/profile` while signed out redirects to `/admin/login`.
- Edit the bio, upload a photo and a CV, add a job and reorder it; reload `/` and confirm the changes.
- With the anon key only, a direct `insert`/`update` on `profile` is refused by RLS.
- Submit the contact form: the message appears in `/admin/messages` and an email arrives. A 4th submission within 10 minutes is rate limited.
