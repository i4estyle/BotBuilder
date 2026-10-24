const TRANSIENT_DATABASE_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ECONNABORTED',
  'EAI_AGAIN',
  'ENETUNREACH',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST',
  'ER_CON_COUNT_ERROR',
  'ER_QUERY_TIMEOUT',
]);

interface DatabaseErrorLike {
  code?: unknown;
  cause?: unknown;
  driverError?: unknown;
}

function errorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const code = (error as DatabaseErrorLike).code;
  return typeof code === 'string' ? code : undefined;
}

/**
 * Detect failures that are safe to retry for read-only HTTP requests.
 * Authentication, SQL syntax, and constraint errors deliberately return false.
 */
export function isTransientDatabaseError(error: unknown): boolean {
  const candidate = error as DatabaseErrorLike;
  const codes = [
    errorCode(error),
    errorCode(candidate?.driverError),
    errorCode(candidate?.cause),
  ];
  return codes.some(
    (code) => code !== undefined && TRANSIENT_DATABASE_ERROR_CODES.has(code),
  );
}
