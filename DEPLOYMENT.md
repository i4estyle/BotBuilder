# BotBuilder — Production Deployment

## Services

| ส่วน | ผู้ให้บริการ | หน้าที่ |
| --- | --- | --- |
| Frontend | Vercel | Vue 3 / Quasar SPA |
| Backend | Render | NestJS API |
| Database | TiDB Cloud Starter | MySQL-compatible managed database |
| Monitoring | UptimeRobot | Monitor API + database readiness |

## Production URLs

- Web: https://botbuilder-web.vercel.app
- API liveness: https://botbuilder-api.onrender.com/api/health
- API + database readiness: https://botbuilder-api.onrender.com/api/health/ready

`/api/health` ตรวจว่า API ยังทำงาน ส่วน `/api/health/ready` ตรวจ query ฐานข้อมูลจริง ใช้ URL หลังสำหรับ monitoring.

ตั้ง UptimeRobot แบบ HTTP(s) ให้ตรวจ `https://botbuilder-api.onrender.com/api/health/ready` ทุก 5 นาที.

## TiDB Cloud Starter

- ใช้ MySQL-compatible protocol ผ่าน TLS
- Serverless และ auto-scaling: ไม่มีการ power off แบบ idle service
- Free quota: 5 GiB row storage และ 50 ล้าน Request Units (RU) ต่อเดือน
- ตั้ง Spending Limit เป็น `$0` เพื่อไม่ให้มีค่าใช้จ่ายเกิน quota
- เมื่อ quota หมด ระบบอาจ throttle หรือปฏิเสธ connection ใหม่จนกว่าจะเริ่มเดือนใหม่

## Render environment (database)

```dotenv
DB_TYPE=mysql
DB_HOST=<TiDB host>
DB_PORT=4000
DB_USER=<TiDB user>
DB_PASSWORD=<TiDB password>
DB_NAME=botbuilder
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA_BASE64=<Base64-encoded TiDB CA certificate>
DB_CONNECT_RETRY_ATTEMPTS=10
DB_CONNECT_RETRY_DELAY_MS=3000
DB_POOL_MAX=5
```

## Resilience

- API retries initial database connections during startup.
- Read-only requests retry short-lived database/network failures.
- Database failures return HTTP `503` instead of a generic `500`.
- Never commit passwords, certificates, or production environment values to Git.
