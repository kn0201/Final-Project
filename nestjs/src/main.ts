import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import { env } from './env';
import dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
import { setSocketIO } from './io';

async function bootstrap() {
  let port = env.WEB_PORT;
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  nestApp.enableCors();
  nestApp.useStaticAssets('uploads');

  let httpServer = await nestApp.listen(port);
  print(port);

  let io = new Server(httpServer, { cors: {} });
  setSocketIO(io);
}
bootstrap();

dotenv.config();
