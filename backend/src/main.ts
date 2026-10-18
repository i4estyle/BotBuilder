import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const rawFrontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!requestOrigin) return callback(null, true);
      if (
        requestOrigin.includes('localhost') ||
        requestOrigin.includes('127.0.0.1') ||
        requestOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      if (rawFrontendUrl) {
        const allowed = rawFrontendUrl.split(',').map((url) => url.trim());
        if (allowed.includes(requestOrigin)) return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BotBuilder API')
    .setDescription('BotBuilder Backend API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error(err);
});
