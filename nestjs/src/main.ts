import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from './env';
import dotenv from 'dotenv';

async function bootstrap() {
  let port = env.WEBP_PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);

  print(port);
}
bootstrap();

// dotenv.config();
