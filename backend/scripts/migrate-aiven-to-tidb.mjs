import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDirectory, '../../.env') });

function usage() {
  console.error(
    'Usage: node scripts/migrate-aiven-to-tidb.mjs --target-host <host> --target-user <user> --target-database <database> --ca <path> [--target-port 4000]',
  );
  process.exit(1);
}

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) usage();
  return value;
}

function quoteIdentifier(identifier) {
  return `\`${identifier.replaceAll('`', '``')}\``;
}

function normaliseValue(value) {
  if (value === null || Buffer.isBuffer(value) || value instanceof Date) {
    return value;
  }
  return typeof value === 'object' ? JSON.stringify(value) : value;
}

async function readHidden(prompt) {
  if (!process.stdin.isTTY) {
    throw new Error('A TTY is required to enter the TiDB password safely.');
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  return new Promise((resolve, reject) => {
    let value = '';
    const onData = (key) => {
      if (key === '\u0003') {
        cleanup();
        reject(new Error('Migration cancelled.'));
      } else if (key === '\r' || key === '\n') {
        cleanup();
        process.stdout.write('\n');
        resolve(value);
      } else if (key === '\u0008' || key === '\u007f') {
        value = value.slice(0, -1);
      } else {
        value += key;
      }
    };
    const cleanup = () => {
      process.stdin.off('data', onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };
    process.stdin.on('data', onData);
  });
}

async function tableCounts(connection, database, tableNames) {
  const counts = new Map();
  for (const tableName of tableNames) {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS rowCount FROM ${quoteIdentifier(database)}.${quoteIdentifier(tableName)}`,
    );
    counts.set(tableName, Number(rows[0].rowCount));
  }
  return counts;
}

async function main() {
  const targetHost = argument('--target-host');
  const targetUser = argument('--target-user');
  const targetDatabase = argument('--target-database');
  const targetPort = Number(argument('--target-port', '4000'));
  const certificatePath = argument('--ca');
  if (!targetHost || !targetUser || !targetDatabase || !certificatePath) usage();

  const source = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  if (Object.values(source).some((value) => !value)) {
    throw new Error('Root .env must contain the current Aiven DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME.');
  }

  const targetPassword = await readHidden('TiDB password (input hidden): ');
  if (!targetPassword) throw new Error('TiDB password cannot be empty.');
  const targetCa = await fs.readFile(certificatePath, 'utf8');

  const sourceConnection = await mysql.createConnection({
    ...source,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  const targetConnection = await mysql.createConnection({
    host: targetHost,
    port: targetPort,
    user: targetUser,
    password: targetPassword,
    database: targetDatabase,
    ssl: { ca: targetCa, rejectUnauthorized: true },
  });

  try {
    const [sourceTables] = await sourceConnection.query(
      `SELECT TABLE_NAME AS tableName
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [source.database],
    );
    const tableNames = sourceTables.map((row) => row.tableName);
    if (tableNames.length === 0) {
      throw new Error('The Aiven source database has no tables; migration stopped.');
    }

    const [targetTables] = await targetConnection.query(
      `SELECT TABLE_NAME AS tableName
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'`,
      [targetDatabase],
    );
    if (targetTables.length > 0) {
      throw new Error(
        `TiDB database ${targetDatabase} is not empty; migration stopped to prevent overwriting data.`,
      );
    }

    console.log(`Copying ${tableNames.length} tables from Aiven to TiDB...`);
    for (const tableName of tableNames) {
      const quotedTable = quoteIdentifier(tableName);
      const [createRows] = await sourceConnection.query(
        `SHOW CREATE TABLE ${quotedTable}`,
      );
      const createSql = createRows[0]['Create Table'];
      await targetConnection.query(createSql);

      const [rows] = await sourceConnection.query(`SELECT * FROM ${quotedTable}`);
      if (rows.length === 0) {
        console.log(`- ${tableName}: schema copied (0 rows)`);
        continue;
      }

      const columns = Object.keys(rows[0]);
      const columnSql = columns.map(quoteIdentifier).join(', ');
      const insertSql = `INSERT INTO ${quotedTable} (${columnSql}) VALUES ?`;
      const chunkSize = 250;
      for (let index = 0; index < rows.length; index += chunkSize) {
        const batch = rows.slice(index, index + chunkSize).map((row) =>
          columns.map((column) => normaliseValue(row[column])),
        );
        await targetConnection.query(insertSql, [batch]);
      }
      console.log(`- ${tableName}: schema and ${rows.length} rows copied`);
    }

    const sourceCounts = await tableCounts(
      sourceConnection,
      source.database,
      tableNames,
    );
    const targetCounts = await tableCounts(
      targetConnection,
      targetDatabase,
      tableNames,
    );
    const mismatches = tableNames.filter(
      (tableName) => sourceCounts.get(tableName) !== targetCounts.get(tableName),
    );
    if (mismatches.length > 0) {
      throw new Error(`Row-count validation failed: ${mismatches.join(', ')}`);
    }

    console.log('Migration complete. Schema, data, and row counts match.');
  } finally {
    await Promise.allSettled([
      sourceConnection.end(),
      targetConnection.end(),
    ]);
  }
}

main().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exitCode = 1;
});
