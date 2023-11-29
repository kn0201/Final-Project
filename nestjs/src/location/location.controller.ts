import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { LocationService } from './location.service';
import {
  addBookmarkParser,
  locationImageParser,
  markerParser,
} from 'utils/parser';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/uploads';
import { writeFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import { AuthGuard } from 'src/auth/auth.guard';
import { getJWTPayload } from 'src/jwt';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  async getMarker() {
    return this.locationService.getMarker();
  }

  @Post('Marker')
  async addMarker(@Body() body: Body) {
    let input = markerParser.parse(body);
    return this.locationService.addMarker(input);
  }

  // @UseGuards(AuthGuard)
  @Get(':id/checkBookmark')
  async checkBookmark(@Param() param: any, @Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.locationService.checkBookmark({
      user_id: jwt.user_id,
      place_id: param.id,
    });
  }

  @Get('bookmark')
  async getBookmark(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.locationService.getBookmark({
      user_id: jwt.user_id,
    });
  }

  @UseGuards(AuthGuard)
  @Post('bookmark')
  async bookmark(@Body() body: Body, @Headers() headers: {}) {
    // console.log('add');

    let jwt = getJWTPayload(headers);
    let input = addBookmarkParser.parse(body);
    return this.locationService.bookmark({
      user_id: jwt.user_id,
      place_id: input.place_id,
      name: input.name,
      latitude: input.geometry.latitude,
      longitude: input.geometry.longitude,
      address: input.address,
    });
  }
  @UseGuards(AuthGuard)
  @Patch('bookmark')
  async deleteBookmark(@Body() body: Body, @Headers() headers: {}) {
    // console.log('delete');

    let jwt = getJWTPayload(headers);
    let input = addBookmarkParser.parse(body);
    return this.locationService.deleteBookmark({
      user_id: jwt.user_id,
      place_id: input.place_id,
    });
  }
}
