import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, throwError, timer } from 'rxjs';
import { retry } from 'rxjs/operators';
import { isTransientDatabaseError } from '../utils/database-error.util.js';

/**
 * Retries only idempotent HTTP reads after a short-lived database/network error.
 * Mutating requests must never be retried here because their first attempt might
 * have committed before the connection was interrupted.
 */
@Injectable()
export class DatabaseReadRetryInterceptor implements NestInterceptor {
  private static readonly retryableMethods = new Set([
    'GET',
    'HEAD',
    'OPTIONS',
  ]);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!DatabaseReadRetryInterceptor.retryableMethods.has(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      retry({
        count: 2,
        delay: (error: unknown, retryCount: number) => {
          if (!isTransientDatabaseError(error)) {
            return throwError(() => error);
          }
          // 250 ms, then 750 ms: enough for a dropped pool connection without
          // making a user-facing read hang for a long time.
          return timer(retryCount === 1 ? 250 : 750);
        },
      }),
    );
  }
}
