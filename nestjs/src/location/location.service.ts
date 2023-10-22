import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

type Marker = {
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  placeId: string;
  placeName: string;
};

@Injectable()
export class LocationService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async addMarker(input: Marker[]) {
    for (let marker of input) {
      let system_location_record = await this.knex
        .select('id', 'place_id')
        .from('system_location')
        .where({
          place_id: marker.placeId,
        })
        .first();

      if (system_location_record == undefined) {
        await this.knex('system_location').insert({
          place_id: marker.placeId,
          name: marker.placeName,
          address: marker.address,
          latitude: marker.coordinate.latitude,
          longitude: marker.coordinate.longitude,
        });
      }
    }
    return {};
  }

  async getMarker() {
    let result = await this.knex
      .select('place_id', 'name', 'address', 'latitude', 'longitude')
      .from('system_location');

    return result;
  }
}
