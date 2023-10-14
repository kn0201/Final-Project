import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
