import { Module } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class PlanningModule {}
