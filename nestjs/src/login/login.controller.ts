import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { object, string } from 'cast.ts';
import { LoginService } from './login.service';
import { loginParser, signUpParser } from 'utils/parser';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(@Body() body: Body) {
    let input = loginParser.parse(body);
    return this.loginService.login(input);
  }

  @Post('register')
  async register(@Body() body: Body) {
    let input = signUpParser.parse(body);
    return this.loginService.register(input);
  }
}
