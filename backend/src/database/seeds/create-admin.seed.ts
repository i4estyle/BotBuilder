import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
function id(): string { return Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 36))).join(''); }
async function run(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase(); const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
  const connection = await mysql.createConnection({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [rows] = await connection.execute('SELECT ADMIN_ID FROM BB_ADMIN WHERE EMAIL = ? LIMIT 1', [email]);
    const admins = rows as Array<{ ADMIN_ID: string }>;
    if (admins.length) await connection.execute('UPDATE BB_ADMIN SET PASSWORD_HASH = ?, STATUS = ? WHERE ADMIN_ID = ?', [hash, 'ACTIVE', admins[0].ADMIN_ID]);
    else await connection.execute('INSERT INTO BB_ADMIN (ADMIN_ID, LOGIN_NAME, DISPLAY_NAME, EMAIL, PASSWORD_HASH, STATUS) VALUES (?, ?, ?, ?, ?, ?)', [id(), process.env.ADMIN_LOGIN_NAME || email, process.env.ADMIN_NAME || 'Administrator', email, hash, 'ACTIVE']);
  } finally { await connection.end(); }
}
run().catch((error: unknown) => { console.error('Failed to seed admin:', error); process.exitCode = 1; });
