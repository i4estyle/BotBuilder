# BotBuilder — Deployment Plan

## Current production stack

| Layer | Service | Role |
| --- | --- | --- |
| Frontend | Vercel | Vue 3 / Quasar static SPA |
| Backend | Render | NestJS API |
| Database | TiDB Cloud Starter | MySQL-compatible managed database |
| Monitoring | UptimeRobot | Monitor API + database readiness |

## Deployment flow

1. Push to `main` → Vercel and Render deploy from GitHub.
2. Render connects to TiDB using TLS and the `DB_*` environment variables.
3. TypeORM runs pending migrations at startup (`migrationsRun: true`).
4. Monitor `https://botbuilder-api.onrender.com/api/health/ready` for a real DB query.

## Required checks after deployment

- `/api/health` returns HTTP 200.
- `/api/health/ready` returns HTTP 200.
- `/api/page-sections` returns HTTP 200.
- Admin login works and page edits persist after refresh.

## TiDB Free plan

- MySQL-compatible, TLS required, request-driven autoscaling.
- Free quota: 5 GiB row storage and 50 million RU/month.
- Spending limit is `$0`; usage beyond quota can be throttled or reject new connections until the next month.
- Idle public connections can close; the API has startup retries and safe read-only retries.

## Operational rules

- Keep production secrets only in Render/Vercel environment variables.
- Never commit `.env`, certificates, passwords, or service-account keys.
- Change exposed credentials immediately.
- Check TiDB's monthly usage dashboard periodically.
- Use persistent object storage for uploaded files; Render local disk is ephemeral.
