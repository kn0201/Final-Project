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
  Headers,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { sendProfileParser, updateUsernameParser } from 'utils/parser';
import { getJWTPayload, maybeGetJWTPayload } from 'src/jwt';
import { storage } from 'src/uploads';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('hobby_list')
  async getHobbyList() {
    return this.userService.getHobbyList();
  }

  @Get(':post_id/:id/:post_user_id')
  async getOtherProfile(
    @Param('post_id') post_id: string,
    @Param('id') id: string,
    @Param('post_user_id') post_user_id: string,
  ) {
    return this.userService.getOtherProfile(+post_id, +id, +post_user_id);
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
    // console.log('image:', image);
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

  @Get('userIcon')
  async getUserIcon(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.userService.getUserIcon({
      user_id: jwt.user_id,
    });
  }

  @Get('bookmark')
  async getUserBookmark(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.userService.getUserBookmark({
      user_id: jwt.user_id,
    });
  }
  @Get('ownPost')
  async getOwnPost(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.userService.getOwnPost({
      user_id: jwt.user_id,
    });
  }

  @Get('new')
  async getNewPost(@Headers() headers: {}) {
    let jwt = maybeGetJWTPayload(headers);
    return this.userService.getNewPost({
      user_id: jwt?.user_id,
    });
  }
}
