# UDAAN CREDIT — Cloudflare Pages + D1

Premium responsive financial-services website with a real Cloudflare Pages Functions backend, D1 persistence, server-side admin authentication, enquiry management and editable website content.

## Included
- Public responsive website, all requested service categories and individual service choices
- Enquiry form with server-side validation and D1 persistence
- `/admin` login and dashboard, enquiry search/filter/status/notes/delete/CSV export
- Editable company/contact/social settings and service catalogue
- PBKDF2 password hashes, HttpOnly Secure SameSite session cookie, CSRF token checks
- One-time admin bootstrap endpoint; no default password is embedded in frontend source

## Before deployment
1. Create a Cloudflare account and install Node.js + Wrangler:
   ```bash
   npm install -g wrangler
   wrangler login
   ```
2. Create D1 database:
   ```bash
   wrangler d1 create udaan-credit-db
   ```
3. Copy the returned database ID into `wrangler.toml` replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
4. Apply migrations:
   ```bash
   wrangler d1 migrations apply udaan-credit-db --remote
   ```
5. Set a long, random one-time setup secret:
   ```bash
   wrangler pages secret put BOOTSTRAP_SECRET --project-name udaan-credit
   ```
   When prompted, paste a random secret (at least 32 random characters). Do not share it.
6. Deploy:
   ```bash
   wrangler pages project create udaan-credit
   wrangler pages deploy public --project-name udaan-credit
   ```
   If the Pages project already exists, only run the deploy command.

## Initial administrator setup
The initial credentials are deliberately **not pre-created or hardcoded**. This prevents a public, predictable admin password from being active on every installation.

After deploying and setting `BOOTSTRAP_SECRET`, run this once from a trusted computer (replace the URL and secret). This creates the first admin with the requested initial login, stores only a PBKDF2 hash, and forces a password change:

```bash
curl -X POST "https://YOUR-PAGES-DOMAIN/api/admin-setup" \
  -H "Content-Type: application/json" \
  -H "X-Setup-Secret: YOUR_BOOTSTRAP_SECRET" \
  -d '{"username":"admin","password":"Udaan@2026"}'
```

**Important:** The requested one-time temporary password is `Udaan@2026`. The setup endpoint accepts it only for the first administrator; the account is forced to change it immediately. Choose a unique password of at least 12 characters at `/admin` → Admin Account. Once an admin exists, the setup endpoint returns 409 and cannot create another admin.

Login URL: `https://YOUR-PAGES-DOMAIN/admin`  
Initial username: `admin`  
Initial temporary password: `Udaan@2026` (one-time; forced password change on first login).

## Manual database management
- Cloudflare Dashboard → Workers & Pages → D1 → `udaan-credit-db` → Browse data.
- `enquiries`: submitted enquiry records and statuses.
- `admin_users`: usernames and password hashes (never edit hashes manually).
- `admin_sessions`: active sessions; deleting a row logs that session out.
- `website_settings`: key/value settings.
- `services`: service catalogue shown publicly.
- `rate_limits`: server-side rate limit counters.
- Admin panel changes are saved directly to D1. You can also inspect records manually in the D1 console.
- Back up D1 regularly from the Cloudflare dashboard or with Wrangler.

## Routes
- `GET /api/settings` public settings and active services
- `POST /api/enquiry` create enquiry
- `POST /api/admin-setup` one-time initial admin bootstrap (requires secret)
- `POST /api/admin-login`, `POST /api/admin-logout`, `GET /api/admin-session`
- `GET /api/admin-enquiries`
- `POST /api/admin-update-enquiry`, `POST /api/admin-delete-enquiry`
- `GET /api/admin-export`
- `GET/POST /api/admin-settings`
- `POST /api/admin-change-password`, `POST /api/admin-change-username`

## Custom domain
Cloudflare Dashboard → Workers & Pages → your Pages project → Custom domains → Set up a custom domain. Follow DNS prompts and wait for certificate provisioning. Then update `SITE_URL` in `wrangler.toml` and redeploy.

## Test checklist
1. Submit an enquiry from the homepage using a valid Indian 10-digit mobile number.
2. Confirm it appears in `/admin` → Enquiries and D1 → Browse data → `enquiries`.
3. Change status and add an internal note; refresh to confirm persistence.
4. Export CSV.
5. Change WhatsApp/customer-care details under Website Settings and reload the public homepage.
6. Change the initial password and confirm the new password works.

## Important production notes
- Set `BOOTSTRAP_SECRET` as a Cloudflare Pages secret before initial setup. Do not put secrets in source control.
- This starter uses a D1 fixed-window rate limiter. For high traffic, consider Cloudflare Turnstile and/or a Durable Object rate limiter.
- Add a Cloudflare Turnstile challenge to public enquiry submission before opening to heavy public traffic.
- Configure a Cloudflare WAF/rate limiting rule for `/api/admin-login` and `/api/enquiry`.
- Add your real company contact details, registered business details, privacy notice and service-specific disclosures before launch.
- Financial, insurance, investment, education and registration services may require appropriate licences, authorisations, disclosures or regulated partners. Do not imply that UDAAN CREDIT itself is a bank, insurer, lender, investment adviser, university or regulator unless duly authorised. Mutual fund distribution/investment-related activity must be conducted only through appropriately registered entities/personnel.
- The website is a deployable project scaffold; perform a staging test, legal review, security review and backup setup before production use.
