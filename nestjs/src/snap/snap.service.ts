import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class SnapService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getSnapList() {
    return;
  }

  async postSnap(input: {
    user_id: number;
    body: {
      type: string;
      place_id: string;
      name: string;
      address: string;
      latitude: number;
      longitude: number;
      content: string;
    };
    image;
  }) {
    let filename = input.image.filename;
    console.log(filename);
    let body = input.body;

    let system_location_id = await this.knex
      .select('id')
      .from('system_location')
      .where('place_id', body.place_id)
      .first();

    if (system_location_id != undefined) {
      let id = await this.knex('system_location')
        .insert({
          name: body.name,
          place_id: body.place_id,
          address: body.address,
          latitude: body.latitude,
          longitude: body.longitude,
        })
        .returning('id');
    }
  }
}
