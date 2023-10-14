import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService, JwtService],
})
export class LoginModule {}
