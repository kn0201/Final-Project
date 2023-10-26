import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { LoginService } from './login.service';
import {
  checkEmailParser,
  checkUsernameParser,
  loginParser,
  signUpParser,
} from 'utils/parser';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';

let storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, callback) {
    let ext = file.mimetype.match(/^image\/([\w-]+)/)?.[1] || 'bin';
    let filename = randomUUID() + '.' + ext;
    callback(null, filename);
  },
});
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  async login(@Body() body: Body) {
    let input = loginParser.parse(body);
    return this.loginService.login(input);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async register(@Body() body: Body, @UploadedFile() image) {
    console.log(body);
    console.log('image:', image);
    let input = signUpParser.parse(body);
    return this.loginService.register(input, image);
  }

  @Get('check_username')
  async checkUsername(@Query() query: {}) {
    let input = checkUsernameParser.parse(query);
    return this.loginService.checkUsername(input);
  }

  @Get('check_email')
  async checkEmail(@Query() query: {}) {
    let input = checkEmailParser.parse(query);
    return this.loginService.checkEmail(input);
  }
}
