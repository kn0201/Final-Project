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

  async checkBookmark(input: { user_id: number; place_id: any }) {
    console.log(input.place_id.id);

    let foundBookmark = await this.knex('user_location')
      .select('id')
      .where('place_id', input.place_id)
      .andWhere('user_id', input.user_id)
      .andWhere('is_delete', false)
      .first();
    console.log(foundBookmark);

    if (foundBookmark == undefined) {
      return { result: false };
    } else {
      return { result: true };
    }
  }

  async bookmark(input: { user_id: number; place_id: string }) {
    let foundBookmark = await this.knex('user_location')
      .select('id')
      .where('place_id', input.place_id)
      .andWhere('user_id', input.user_id)
      .andWhere('is_delete', true)
      .first();

    if (foundBookmark == undefined) {
      await this.knex('user_location').insert({
        user_id: input.user_id,
        place_id: input.place_id,
        is_delete: false,
      });
    } else {
      await this.knex('user_location').where('id', foundBookmark.id).update({
        is_delete: false,
      });
    }

    return { result: true };
  }

  async deleteBookmark(input: { user_id: number; place_id: string }) {
    let foundBookmark = await this.knex('user_location')
      .select('id')
      .where('place_id', input.place_id)
      .andWhere('user_id', input.user_id)
      .first();

    await this.knex('user_location').where('id', foundBookmark.id).update({
      is_delete: true,
    });

    return { result: false };
  }
}
