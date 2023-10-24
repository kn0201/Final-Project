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
      // console.log(marker);

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
        console.log('add Marker : ' + marker.placeName);
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

  async getBookmark(input: { user_id: number }) {
    let bookmarkList = await this.knex('user_location')
      .select(
        'system_location.name as name',
        'user_location.place_id',
        'system_location.latitude as latitude',
        'system_location.longitude as longitude',
      )
      .where('user_id', input.user_id)
      .andWhere('is_delete', false)
      .leftJoin(
        'system_location',
        'system_location.id',
        'user_location.system_location_id',
      );

    return bookmarkList;
  }

  async bookmark(input: {
    user_id: number;
    place_id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
  }) {
    let foundBookmark = await this.knex('user_location')
      .select('id')
      .where('place_id', input.place_id)
      .andWhere('user_id', input.user_id)
      .andWhere('is_delete', true)
      .first();

    let system_location_id = await this.knex
      .select('id')
      .from('system_location')
      .where('place_id', input.place_id)
      .first();

    if (foundBookmark == undefined) {
      if (system_location_id == undefined) {
        let id = await this.knex('system_location')
          .insert({
            name: input.name,
            place_id: input.place_id,
            address: input.address,
            latitude: input.latitude,
            longitude: input.longitude,
          })
          .returning('id');

        await this.knex('user_location').insert({
          system_location_id: id[0].id,
          user_id: input.user_id,
          place_id: input.place_id,
          is_delete: false,
        });
      } else {
        await this.knex('user_location').insert({
          system_location_id: system_location_id.id,
          user_id: input.user_id,
          place_id: input.place_id,
          is_delete: false,
        });
      }
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
