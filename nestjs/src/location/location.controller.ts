import { Body, Controller, Get, Post } from '@nestjs/common';
import { LocationService } from './location.service';
import { markerParser } from 'utils/parser';

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
}
