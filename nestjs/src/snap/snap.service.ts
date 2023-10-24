import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { type } from 'os';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class SnapService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getSnapList() {
    let result = await this.knex
      .select(
        'post.id',
        'post.user_id',
        'users.username as username',
        'post.content',
        'post.created_at',
        'system_location.name as location_name',
        'image.path as image_path',
        'image.path as avatar_path',
      )
      .from('post')
      .where('post.type', 'snap')
      .leftJoin('users', 'post.user_id', 'users.id')
      .leftJoin(
        'system_location',
        'post.system_location_id',
        'system_location.id',
      )
      .innerJoin('image', function () {
        this.on('image.post_id', '=', 'post.id').orOn(
          'users.avatar_id',
          '=',
          'image.id',
        );
      });
    //   .leftJoin('image', 'users.avatar_id', 'image.id');
    console.log(result);

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

    if (system_location_id == undefined) {
      let result = await this.knex('system_location')
        .insert({
          name: body.name,
          place_id: body.place_id,
          address: body.address,
          latitude: body.latitude,
          longitude: body.longitude,
        })
        .returning('id');

      let post = await this.knex('post')
        .insert({
          user_id: input.user_id,
          type: body.type,
          content: body.content,
          system_location_id: result[0].id,
          view: 0,
          is_delete: false,
        })
        .returning('id');

      await this.knex('image').insert({
        user_id: input.user_id,
        post_id: post[0].id,
        path: filename,
        is_delete: false,
      });
    } else {
      let post = await this.knex('post')
        .insert({
          user_id: input.user_id,
          type: body.type,
          content: body.content,
          system_location_id: system_location_id.id,
          view: 0,
          is_delete: false,
        })
        .returning('id');

      await this.knex('image').insert({
        user_id: input.user_id,
        post_id: post[0].id,
        path: filename,
        is_delete: false,
      });
    }
    return { result: true };
  }
}
