import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService, JwtService],
})
export class LocationModule {}
