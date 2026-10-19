import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable trust proxy so Express correctly reads X-Forwarded-For from Render / Cloud reverse proxies
  app.set('trust proxy', 1);

  // Helmet HTTP Security Headers (X-Frame-Options, X-XSS-Protection, etc.)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Anti-ENV Probe & Secret Shield Middleware: immediately block .env / .git / sensitive scanner probes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestPath = req.path.toLowerCase();
    if (
      requestPath.includes('.env') ||
      requestPath.includes('.git') ||
      requestPath.includes('.aws') ||
      requestPath.endsWith('.yml') ||
      requestPath.endsWith('.yaml')
    ) {
      return res.status(403).json({ statusCode: 403, message: 'Forbidden' });
    }
    next();
  });

  const rawFrontendUrl = process.env.FRONTEND_URL;
  const defaultAllowedOrigins = [
    'https://botbuilder-web.vercel.app',
    'http://localhost:9000',
    'http://localhost:3000',
  ];
  const configuredOrigins = rawFrontendUrl
    ? rawFrontendUrl.split(',').map((url) => url.trim().replace(/\/$/, ''))
    : [];
  const allowedOrigins = new Set([
    ...defaultAllowedOrigins,
    ...configuredOrigins,
  ]);

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow internal server-to-server or curl requests with no origin header
      if (!requestOrigin) return callback(null, true);

      const cleanOrigin = requestOrigin.replace(/\/$/, '');
      if (allowedOrigins.has(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow local development domains only when not in production
      if (process.env.NODE_ENV !== 'production') {
        if (
          cleanOrigin.includes('localhost') ||
          cleanOrigin.includes('127.0.0.1')
        ) {
          return callback(null, true);
        }
      }

      return callback(new Error('CORS: Origin not allowed'), false);
    },
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // Serve static uploaded assets safely (dotfiles denied, directory browsing disabled)
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    dotfiles: 'deny',
    index: false,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter to sanitize errors and hide internal DB details in production
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Expose Swagger UI in development environment only
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BotBuilder API')
      .setDescription('BotBuilder Backend API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error(err);
});
