import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { sendProfileParser } from 'utils/parser';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return this.userService.getProfile(req);
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  async sendProfile(@Body() body: Body, @Req() req: Request) {
    let input = sendProfileParser.parse(body);
    return this.userService.sendProfile(input, req);
  }

  @Get('language_list')
  async getLanguageList() {
    return this.userService.getLanguageList();
  }

  @Get('hobby_list')
  async getHobbyList() {
    return this.userService.getHobbyList();
  }
}
