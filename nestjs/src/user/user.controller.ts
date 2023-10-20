import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Header,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { sendProfileParser, updateUsernameParser } from 'utils/parser';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { getJWTPayload } from 'src/jwt';

let storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, callback) {
    let ext = file.mimetype.match(/^image\/([\w-]+)/)?.[1] || 'bin';
    let filename = randomUUID() + '.' + ext;
    callback(null, filename);
  },
});
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('hobby_list')
  async getHobbyList() {
    return this.userService.getHobbyList();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    return this.userService.getProfile(req);
  }

  @Get('icon')
  async getIcon(@Headers() headers: Headers) {
    return this.userService.getIcon(headers);
  }
  @UseGuards(AuthGuard)
  @Post('profile')
  async sendProfile(@Body() body: Body, @Req() req: Request) {
    let input = sendProfileParser.parse(body);
    return this.userService.sendProfile(input, req);
  }

  @UseGuards(AuthGuard)
  @Patch('update_icon')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async updateIcon(@UploadedFile() image, @Req() req: Request) {
    console.log('image:', image);
    return this.userService.updateIcon(image, req);
  }

  @UseGuards(AuthGuard)
  @Patch('update_username')
  async updateUsername(@Body() body: Body, @Headers() headers: {}) {
    let input = updateUsernameParser.parse(body);
    let jwt = getJWTPayload(headers);
    return this.userService.updateUsername({
      user_id: jwt.user_id,
      username: input.username,
    });
  }
}
