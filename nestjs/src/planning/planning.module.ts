import { Module } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
@Module({
  controllers: [PlanningController],
  providers: [PlanningService, JwtService],
})
export class PlanningModule {}
