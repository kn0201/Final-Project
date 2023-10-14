import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { sendProfileParser } from 'utils/parser';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    return this.userService.getProfile();
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  async sendProfile(@Body() body: Body) {
    let input = sendProfileParser.parse(body);
    return this.userService.sendProfile(input);
  }
}
