# Move BotBuilder from Aiven MySQL to TiDB Cloud Starter

This runbook uses a short maintenance window and keeps Aiven untouched until
TiDB has been verified. It does not require committing any secret.

## 1. Create TiDB (manual account step)

1. Sign in to TiDB Cloud and create a **Starter** instance with **MySQL
   Compatible** mode.
2. Keep the default free spending limit of `0`.
3. In **Connect**, create a SQL user and download the CA certificate.
4. Record the host, port, username, password, and database name shown there.

Do not use PostgreSQL Compatible mode for this project: BotBuilder uses
`mysql2`, TypeORM's MySQL driver, and MySQL migrations.

## 2. Copy Aiven data before any switch

The repository includes `backend/scripts/migrate-aiven-to-tidb.mjs`. It reads
the existing Aiven connection only from the local root `.env`, prompts for the
TiDB password without echoing it, refuses to run when TiDB is not empty, copies
every table (including TypeORM's `migrations` table), and validates row counts.

From PowerShell:

```powershell
cd backend
pnpm run migrate:aiven:tidb -- --target-host <TIDB_HOST> --target-port 4000 --target-user <TIDB_USER> --target-database botbuilder --ca C:\path\to\tidb-ca.pem
```

Retain the Aiven service and its original Render variables until all checks
below pass.

## 3. Validate TiDB before changing Render

Connect with the TiDB command and run:

```sql
SELECT 1;
SHOW TABLES;
SELECT COUNT(*) AS applied_migrations FROM migrations;
SELECT COUNT(*) AS admins FROM BB_ADMIN;
SELECT COUNT(*) AS page_sections FROM BB_PAGE_SECTION;
```

Confirm the tables and row counts match Aiven. Do not proceed if any command
fails. TiDB is MySQL-compatible but not every MySQL feature is identical; this
validation is the rollback gate for the project's raw SQL migrations.

## 4. Switch Render

1. Render dashboard -> `botbuilder-api` -> **Environment**.
2. Copy the existing `DB_*` values to a private rollback note.
3. Set every variable in the `Render environment variables` section of
   [DEPLOYMENT.md](../DEPLOYMENT.md).
4. Save changes, then use **Manual Deploy -> Deploy latest commit** (or
   restart after this repository commit is deployed).
5. Watch Render logs. The app must start without migration or TLS errors.

## 5. Verify production

Run these read-only requests:

```powershell
Invoke-WebRequest https://botbuilder-api.onrender.com/api/health
Invoke-WebRequest https://botbuilder-api.onrender.com/api/health/ready
Invoke-WebRequest https://botbuilder-api.onrender.com/api/page-sections
```

Expected: all return HTTP 200. Then open the public site, log in, and edit one
non-critical page section. Confirm it persists after a browser refresh.

Configure external monitoring for `/api/health/ready`; alert on non-200. A
five-minute interval is sufficient for detecting a database outage. It is an
alert, not a mechanism to defeat a provider's idle policy.

## Rollback

If any production validation fails:

1. Restore the saved Aiven `DB_*` values in Render.
2. Save and redeploy/restart Render.
3. Confirm `/api/health/ready` and `/api/page-sections` return HTTP 200.

No Aiven data is changed during this migration, so this rollback is immediate.
