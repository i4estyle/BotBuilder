# BotBuilder production deployment

## Public endpoints

- Frontend: `https://botbuilder-web.vercel.app`
- API liveness: `https://botbuilder-api.onrender.com/api/health`
- API + database readiness: `https://botbuilder-api.onrender.com/api/health/ready`

`/api/health` only proves that NestJS is running. Use `/api/health/ready` for
monitoring an actual database query.

## Production topology

- Vercel: Vue/Quasar SPA
- Render: NestJS API
- TiDB Cloud Starter: MySQL-compatible managed database

Do not rely on an Aiven Free MySQL service for an always-available production
database: Aiven can power off inactive free services. TiDB Cloud Starter has a
different serverless, request-driven model; it does not require manually
powering a service back on after an idle period. Free tiers are still not an
SLA or a substitute for backups and monitoring.

## Render environment variables

Set these in Render for `botbuilder-api`. Never commit their real values.

```dotenv
NODE_ENV=production
DB_TYPE=mysql
DB_HOST=<TiDB host from Connect>
DB_PORT=<TiDB port from Connect>
DB_USER=<TiDB user from Connect>
DB_PASSWORD=<TiDB password from Connect>
DB_NAME=<TiDB database name from Connect>
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA_BASE64=<Base64 of the TiDB CA PEM file>
DB_CONNECT_RETRY_ATTEMPTS=10
DB_CONNECT_RETRY_DELAY_MS=3000
DB_POOL_MAX=5
```

Create the CA value locally without putting the source PEM in Git:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\tidb-ca.pem'))
```

Paste the command output into `DB_SSL_CA_BASE64`. Do not set
`DB_SSL_REJECT_UNAUTHORIZED=false` for TiDB production.

## Runtime resilience

- Initial database connection retries 10 times with a 3-second delay.
- Only failed GET/HEAD/OPTIONS requests with transient database/network errors
  are retried (250 ms, then 750 ms). Writes are never automatically repeated,
  preventing duplicate saves, tokens, or password-reset actions.
- A remaining transient DB error returns HTTP 503 instead of a misleading 500.

## Migration runbook

Follow [docs/TIDB_MIGRATION.md](docs/TIDB_MIGRATION.md). Take and verify a
backup before editing Render variables. The old Aiven variables remain the
rollback path until TiDB has passed all checks.
