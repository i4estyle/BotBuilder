import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

// Load env variables from the root .env file (same convention as data-source.ts)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

function generateUserId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function run(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      'Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env. Set both before running the seed.',
    );
    process.exitCode = 1;
    return;
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const [rows] = await connection.execute(
      'SELECT USER_ID FROM BB_USER WHERE USER_EMAIL = ? LIMIT 1',
      [email],
    );
    const existing = rows as Array<{ USER_ID: string }>;

    if (existing.length > 0) {
      await connection.execute(
        'UPDATE BB_USER SET PASSWORD_HASH = ?, USER_STATUS = ? WHERE USER_ID = ?',
        [passwordHash, 'ACTIVE', existing[0].USER_ID],
      );
      console.log(`Updated password for existing admin user (${email}).`);
    } else {
      const userId = generateUserId();
      await connection.execute(
        `INSERT INTO BB_USER
          (USER_ID, USER_NAME, NETIONAL_ID, USER_ADDRESS, USER_PHONE, USER_EMAIL, USER_STATUS, PASSWORD_HASH)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          process.env.ADMIN_NAME || 'Administrator',
          process.env.ADMIN_NATIONAL_ID || '0000000000000',
          process.env.ADMIN_ADDRESS || '-',
          process.env.ADMIN_PHONE || '0000000000',
          email,
          'ACTIVE',
          passwordHash,
        ],
      );
      console.log(`Created admin user ${email} (USER_ID: ${userId}).`);
    }
  } finally {
    await connection.end();
  }
}

run().catch((err: unknown) => {
  console.error('Failed to seed admin user:', err);
  process.exitCode = 1;
});
