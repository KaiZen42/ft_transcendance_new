import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: [
      `http://${process.env.BASE_IP}`,
      `http://${process.env.BASE_IP}:3000`,
    ],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
