import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService, JwtService],
})
export class RatingModule {}
