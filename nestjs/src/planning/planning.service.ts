import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { title } from 'process';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}
  async addNewPlan(user_id, body: { title: any; country: any }, image) {
    const { title, country } = body;

    let image_id: number | null = null;
    if (image) {
      let imageName = image.filename;
      let [{ id }] = await this.knex('image')
        .insert({
          user_id,
          path: imageName,
          is_delete: false,
        })
        .returning('id');
      image_id = id;
    }
    return await this.knex('planing').insert({
      title,
      user_id,
      // country,
      privacy: false,
      image_id,
    });
  }

  async getImage(req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;

    let result = await this.knex
      .select('path')
      .from('image')
      .where('user_id', user_id)
      .first();

    console.log(result);
    if (result === undefined) {
      return { path: null };
    }
    console.log(result);
  }
}
