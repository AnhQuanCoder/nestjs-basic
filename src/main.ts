import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // End JWT

  // Config CORS
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
  });
  // End Config CORS

  // Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  // End Interceptor

  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
