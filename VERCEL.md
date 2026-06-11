# Deploy Laxmi Palace Lawn on Vercel

This deploys the project as **two Vercel projects** linked to the same GitHub repo:

| Project | Vercel root dir | What it serves |
|---|---|---|
| `laxmi-palace-lawn` (frontend) | `frontend` | Angular static site |
| `laxmi-palace-lawn-api` (backend) | `backend` | Express serverless API at `/api/*` |

Plus a separate **MySQL host** (Vercel doesn't host MySQL). Free options:
- **TiDB Cloud Serverless** — MySQL-compatible, 5GB free forever → https://tidbcloud.com
- **db4free.net** — Plain MySQL, totally free for hobby projects → https://db4free.net
- **Aiven** — Managed MySQL, 1-month free trial → https://aiven.io

---

## Step 1 — Set up a free MySQL database

### Option A: TiDB Cloud (recommended)
1. Go to https://tidbcloud.com → Sign up with GitHub
2. Click **Create Cluster** → choose **Serverless Tier** (free)
3. Pick the nearest region (Mumbai if available)
4. Click **Create**, then **Connect** → **Standard Connection**
5. Note down: `Endpoint`, `Port`, `User`, `Password`, `Database`
6. Open the SQL editor (Chat2Query) and paste the contents of:
   - `database/schema.sql`  (creates tables)
   - `database/seed.sql`     (sample data — optional)

### Option B: db4free.net
1. Go to https://db4free.net → Register → Confirm via email
2. Note your DB name, username, password (host is always `db4free.net`, port `3306`)
3. Open phpMyAdmin link from the dashboard
4. Click **SQL** tab → paste contents of `database/schema.sql` → **Go**
5. Repeat with `database/seed.sql`

---

## Step 2 — Deploy the backend on Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository** → select **`gaurav9856/laxmi-palace-lawn`**
3. Click **Import**
4. On the configuration screen:
   - **Project Name:** `laxmi-palace-lawn-api`
   - **Framework Preset:** `Other`
   - **Root Directory:** click **Edit** → choose **`backend`**
   - **Build & Output Settings:** leave defaults (vercel.json handles it)
5. Click **Environment Variables** → add these:

   | Name | Value |
   |---|---|
   | `DB_HOST` | (your MySQL host) |
   | `DB_PORT` | `3306` (or `4000` for TiDB) |
   | `DB_USER` | (your MySQL user) |
   | `DB_PASSWORD` | (your MySQL password) |
   | `DB_NAME` | `laxmi_palace_lawn` (or whatever you created) |
   | `DB_SSL` | `true` (required for TiDB; optional for db4free) |
   | `JWT_SECRET` | Long random string. Generate one: paste `openssl rand -base64 48` output, or any 50+ char random string |
   | `JWT_EXPIRES_IN` | `8h` |
   | `CORS_ORIGIN` | Leave blank for now — we'll update after the frontend is deployed |
   | `NODE_ENV` | `production` |

6. Click **Deploy** → wait ~1 minute
7. Once deployed, **copy your API URL** (something like `https://laxmi-palace-lawn-api.vercel.app`)
8. Verify it works: open `https://YOUR-API.vercel.app/api/health` — should show `{"status":"ok",...}`

---

## Step 3 — Seed the admin user

Visit the Vercel project → **Functions** → run this locally to create the admin login:

```bash
# from your laptop, with .env pointing to the production DB
cd backend
npm run seed
```

Or seed by hand in the MySQL console:

```sql
-- Replace the hash by running:
--   node -e "const b=require('bcryptjs'); console.log(b.hashSync('YourStrongPassword!', 10))"
-- Then paste the result below.
INSERT INTO admins (name, email, password_hash, role) VALUES
  ('Your Name', 'admin@laxmipalace.in', '<paste-hash-here>', 'SUPER_ADMIN');
```

---

## Step 4 — Deploy the frontend on Vercel

1. **Before deploying:** update `frontend/src/environments/environment.prod.ts` so `apiUrl` points to the API URL from Step 2, then commit + push:

   ```bash
   cd frontend
   # edit environment.prod.ts: apiUrl: 'https://YOUR-API.vercel.app/api'
   git add src/environments/environment.prod.ts
   git commit -m "Point production frontend at deployed API"
   git push
   ```

2. Go to https://vercel.com/new again → import the same repo
3. On the configuration screen:
   - **Project Name:** `laxmi-palace-lawn`
   - **Framework Preset:** Vercel should auto-detect **Angular**. If not, choose **Other**
   - **Root Directory:** click **Edit** → choose **`frontend`**
4. Click **Deploy** → wait ~2 minutes (Angular build is slow first time)
5. Once deployed, **copy your site URL** (e.g. `https://laxmi-palace-lawn.vercel.app`)

---

## Step 5 — Allow the frontend to call the API

The backend needs to know which origin is allowed to call it.

1. Go to your **API** project on Vercel → **Settings** → **Environment Variables**
2. Find `CORS_ORIGIN` → **Edit**
3. Set its value to your frontend URL: `https://laxmi-palace-lawn.vercel.app`
   (Add a comma-separated list if you have a custom domain too: `https://laxmi-palace-lawn.vercel.app,https://laxmipalace.in`)
4. Go to **Deployments** → click the **⋯** menu on the latest one → **Redeploy** → confirm

---

## Step 6 — Verify

Open your frontend URL and check:

- [ ] Home, About, Gallery pages render ✅
- [ ] Booking page calendar loads (no console errors)
- [ ] Submitting a booking shows the success message
- [ ] Admin login at `/admin/login` works with your seeded credentials
- [ ] Admin dashboard shows your test booking

If something fails, check:
- **API URL** in `frontend/src/environments/environment.prod.ts` — must be HTTPS and end with `/api`
- **CORS_ORIGIN** in the API project — must exactly match the frontend URL
- **DB credentials** in the API project
- API logs: Vercel → API project → **Logs** tab

---

## Custom domain (optional)

1. Buy `laxmipalace.in` from any registrar (GoDaddy, Namecheap, Cloudflare)
2. In Vercel → frontend project → **Settings** → **Domains** → add `laxmipalace.in`
3. Vercel shows the DNS records you need at your registrar (usually one `A` and one `CNAME`)
4. After DNS propagates (~10 min), your site is live at your custom domain
5. Update `CORS_ORIGIN` in the API project to include the new domain

---

## Cost expectations

| Service | Free tier | When you start paying |
|---|---|---|
| Vercel | 100 GB bandwidth/mo, unlimited deployments | Past 100 GB or for team features |
| TiDB Cloud Serverless | 5 GB storage, 50M RU/mo | When you exceed both |
| db4free.net | Free for low-traffic dev only | Not for production scale |

For Laxmi Palace, **free tiers are sufficient** unless you start getting hundreds of bookings per day.
