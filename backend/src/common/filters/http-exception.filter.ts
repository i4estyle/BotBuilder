import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProd = process.env.NODE_ENV === 'production';

    let errorResponse: string | object;

    if (isHttpException) {
      errorResponse = exception.getResponse();
    } else {
      // Internal server or unhandled DB error
      this.logger.error(
        `[${request.method}] ${request.url} - Unhandled Exception`,
        exception instanceof Error ? exception.stack : String(exception),
      );

      // In production, mask internal error details and connection strings
      errorResponse = isProd
        ? {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
          }
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message:
              exception instanceof Error ? exception.message : 'Unknown error',
            error: String(exception),
          };
    }

    response.status(status).json(
      typeof errorResponse === 'string'
        ? {
            statusCode: status,
            message: errorResponse,
          }
        : errorResponse,
    );
  }
}
