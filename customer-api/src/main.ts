import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@/src/utils/environmentConstants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { updateGlobalConfig } from 'nestjs-paginate';
import { allowedOrigins, rateLimiter, securityHeaders } from './utils/httpSecurity';
import { SafeExceptionFilter } from './utils/safeException.filter';

async function bootstrap() {
  updateGlobalConfig({
    defaultOrigin: undefined,
    defaultLimit: 20,
    defaultMaxLimit: 100,
  });

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(securityHeaders, rateLimiter);
  app.useGlobalFilters(new SafeExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Commercor Customer API')
    .setDescription('Commercor API documentation for Customer Project')
    .setVersion('0.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description: 'Enter your bearer token',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, documentFactory);
  app.enableCors({ origin: allowedOrigins(), credentials: true });
  await app.listen(PORT);
}
bootstrap();
