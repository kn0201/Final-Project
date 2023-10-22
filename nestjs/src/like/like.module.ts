import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [LikeController],
  providers: [LikeService, JwtService],
})
export class LikeModule {}
