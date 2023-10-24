import { Module } from '@nestjs/common';
import { SnapController } from './snap.controller';
import { SnapService } from './snap.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [SnapController],
  providers: [SnapService, JwtService],
})
export class SnapModule {}
