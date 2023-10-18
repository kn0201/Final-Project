import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from './env';
import dotenv from 'dotenv';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  let port = env.WEB_PORT;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  await app.listen(port);

  print(port);
}
bootstrap();

dotenv.config();
