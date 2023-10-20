import {
  Body,
  Controller,
  Get,
  Post,
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

  @Post('check_username')
  async checkUsername(@Body() body: Body) {
    let input = checkUsernameParser.parse(body);
    return this.loginService.checkUsername(input);
  }

  @Post('check_email')
  async checkEmail(@Body() body: Body) {
    let input = checkEmailParser.parse(body);
    return this.loginService.checkEmail(input);
  }
}
