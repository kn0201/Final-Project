import { Module } from '@nestjs/common';
import { ServerTestingService } from './server-testing.service';
import { ServerTestingController } from './server-testing.controller';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [ServerTestingController],
  providers: [ServerTestingService, JwtService],
})
export class ServerTestingModule {}
