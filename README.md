# BlezeX Careers Portal

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components · Supabase · Netlify

Public site: `/` (job board), `/jobs/[role]` (job detail), `/apply`, `/thank-you`. Admin: `/admin/login` and `/admin`.
Design: official careers-page layout (job search first, one page per role), fully responsive, with a mobile-first admin panel (candidate cards, bottom-sheet dialogs, collapsible filters).

---

## 1. Run it locally (VS Code)

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site already works without Supabase (it shows the built-in job listings), but applications can only be saved after you connect Supabase.

---

## 2. Connect Supabase (step by step)

### Step 1: Create a project
1. Go to https://supabase.com and sign in (a free account is enough).
2. Click **New project**.
3. Choose an organization, enter a **Name** (for example `blezex-careers`), set a strong **Database Password** (save it somewhere safe), and pick the **Region** closest to your users (for India, choose Mumbai).
4. Select the **Free** plan and click **Create new project**. Wait 1 to 2 minutes until it finishes setting up.

### Step 2: Create the tables
1. In the left sidebar open **SQL Editor** and click **New query**.
2. Open the file `supabase/schema.sql` from this project in VS Code, copy everything, and paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned".
4. Open **Table Editor**. You should now see two tables: `jobs` (with 6 rows) and `applications` (empty).

### Step 3: Copy your two keys
1. Open **Project Settings** (gear icon) then **API** (called **API Keys** in newer dashboards).
2. Copy the **Project URL**. It looks like `https://abcdxyz.supabase.co`.
3. Copy the **service_role** key (the secret key). If your dashboard shows a "Legacy API keys" tab, the `service_role` key is there; a new-style **secret** key also works.
4. Keep the service_role key private. Never put it in public code or share it.

### Step 4: Add them to `.env.local`
Open `.env.local` in the project root and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste-the-service-role-key-here
```

Do not add quotes or spaces. The admin email, password and session secret are already set in this file.

### Step 5: Restart and test
1. In the VS Code terminal press `Ctrl + C`, then run `npm run dev` again (environment files are only read at start-up).
2. Go to http://localhost:3000/apply, complete the form and submit. You should land on the Thank You page.
3. In Supabase open **Table Editor > applications**. Your test application should be there.
4. Go to http://localhost:3000/admin/login and sign in with the admin email and password from `.env.local`. Your test application appears in the dashboard.

### Troubleshooting
| Problem | Fix |
| --- | --- |
| Dashboard says "Supabase is not connected yet" | Keys are empty or misspelled in `.env.local`. Fix them and restart `npm run dev`. |
| "Could not load applications ... relation does not exist" | You have not run `supabase/schema.sql` yet (Step 2). |
| "Invalid API key" | You copied the wrong key. Use the `service_role` / secret key, not the `anon` / publishable key. |
| Application says "could not be saved" | Check the terminal running `npm run dev` for the exact error. |

---

## 3. Admin login

- The email and password are read from environment variables `ADMIN_EMAIL` and `ADMIN_PASSWORD`. They are never shown in the interface, only in masked form.
- Sessions use a signed, HTTP-only cookie (7 days). `ADMIN_SESSION_SECRET` must be a random string of 32+ characters. Generate one with `openssl rand -base64 48`.
- Every `/admin` route is protected by middleware, and every admin action re-checks the session on the server.
- **Before going live, change `ADMIN_PASSWORD` to a new strong password** in Vercel's environment variables.

## 4. Deploy to Netlify (and careers.blezex.com)

Netlify detects Next.js automatically and runs it with server support, so the admin login, server actions and middleware all work. Drag-and-drop upload does not work for this project because it needs a server; deploy from Git.

1. Push this folder to a GitHub repository (`.env.local` is git-ignored, so your secrets stay private).
2. On https://app.netlify.com click **Add new site > Import an existing project**, choose GitHub, and select the repository.
3. Keep the detected settings (build command `npm run build`; `netlify.toml` already sets Node 20). Leave the publish directory as Netlify suggests.
4. Before deploying, click **Add environment variables** and add all six (same names as `.env.local`):
   `NEXT_PUBLIC_SITE_URL` = `https://careers.blezex.com`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (use a new strong password), `ADMIN_SESSION_SECRET` (32+ random characters). Mark `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as **secret** values.
5. Click **Deploy**. Your site goes live on a `something.netlify.app` address.
6. Go to **Domain management > Add a domain**, enter `careers.blezex.com`, and create the DNS record Netlify shows at your domain provider (usually a `CNAME` for `careers` pointing to your `something.netlify.app` address). HTTPS is enabled automatically.
7. Test `/apply`, then `/admin/login`.

If a deploy fails, open **Deploys > the failed deploy > Deploy log** and read the first red error line. If the log mentions "secrets scanning", make sure `netlify.toml` is in the repository root.

## 5. Editing content

| What | Where |
| --- | --- |
| Job listings | Supabase **Table Editor > jobs** (set `status` to `active` or `future`). Changes appear within 5 minutes. |
| Page text, FAQ, perks, "Who should apply" and "You'll learn" per role | `src/lib/content.ts` |
| Contact details, social links | `src/lib/site.ts` |
| Colours and fonts | `tailwind.config.ts` and `src/app/layout.tsx` |
| Fallback jobs (used when Supabase is not connected) | `src/lib/jobs-data.ts` |

## Project structure

```
src/
  app/            pages, server actions, SEO (robots, sitemap), error and loading states
    admin/        /admin and /admin/login
    apply/        multi-step application page and server action
    jobs/[slug]/  job detail page (one per open role)
  components/
    ui/           shadcn-style primitives (button, input, dialog, badge, card)
    site/         careers page sections (navbar, hero, job board, stepper, FAQ...)
    apply/        multi-step application form
    admin/        dashboard, profile card, login form
  lib/            Supabase client, session, validation (zod), content, structured data
  middleware.ts   admin route protection
supabase/schema.sql   tables, indexes, row level security and seed jobs
```
