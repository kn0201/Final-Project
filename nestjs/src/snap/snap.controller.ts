import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Headers,
  UploadedFile,
} from '@nestjs/common';
import { SnapService } from './snap.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/uploads';
import { getJWTPayload } from 'src/jwt';
import { addSnapParser } from 'utils/parser';

@Controller('snap')
export class SnapController {
  constructor(private snapService: SnapService) {}

  @Get()
  async getSnapList() {
    return this.snapService.getSnapList();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async postSnap(
    @Body() body: Body,
    @Headers() headers: {},
    @UploadedFile() image,
  ) {
    console.log(body);
    console.log('image', image);
    let jwt = getJWTPayload(headers);
    let input = addSnapParser.parse(body);
    return this.snapService.postSnap({
      user_id: jwt.user_id,
      body: input,
      image,
    });
  }
}
