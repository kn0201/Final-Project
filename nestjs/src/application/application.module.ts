import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, JwtService],
})
export class ApplicationModule {}
