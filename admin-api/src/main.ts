import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
import flattenValidationErrors from '@/src/utils/functions/flattenClassValidationErrors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from '@/src/utils/environmentConstants';
import { allowedOrigins, rateLimiter, securityHeaders } from './utils/httpSecurity';
import { SafeExceptionFilter } from './utils/safeException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(securityHeaders, rateLimiter);
  app.useGlobalFilters(new SafeExceptionFilter());
  app.setGlobalPrefix('api/admin');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: false, // set true to throw on unknown fields
      transform: true, // auto-transform payloads to DTO types
      // Hides original input/value in errors (safer/cleaner responses)
      validationError: { target: false, value: false },

      // Choose between 400 or 422 here:
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = flattenValidationErrors(errors);

        // 400 (Nest default)
        return new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            errors: formatted,
          },
          HttpStatus.BAD_REQUEST,
        );

        // Or 422 (popular with JSON:API, form UIs)
        // return new UnprocessableEntityException(formatted);
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Commercor Admin API')
    .setDescription('Commercor API documentation for Dashboard')
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
  SwaggerModule.setup('api/admin', app, documentFactory);
  app.enableCors({ origin: allowedOrigins(), credentials: true });
  await app.listen(PORT);
}
bootstrap();
