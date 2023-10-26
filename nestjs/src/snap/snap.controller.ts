import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Headers,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { SnapService } from './snap.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/uploads';
import { getJWTPayload, maybeGetJWTPayload } from 'src/jwt';
import { addSnapParser } from 'utils/parser';

@Controller('snap')
export class SnapController {
  constructor(private snapService: SnapService) {}

  @Get()
  async getSnapList(@Headers() headers: {}) {
    let jwt = maybeGetJWTPayload(headers);
    return this.snapService.getSnapList({
      user_id: jwt?.user_id,
    });
  }

  @Get('own')
  async getOwnSnapList(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);

    return this.snapService.getOwnSnapList({
      user_id: jwt.user_id,
    });
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
