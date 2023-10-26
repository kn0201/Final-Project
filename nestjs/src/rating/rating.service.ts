import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async rating(post_id, body, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const existingRating = await this.knex
        .select('user1', 'user2', 'post_id')
        .from('rating')
        .where('user1', body.user_id)
        .andWhere('user2', user_id)
        .andWhere('post_id', post_id)
        .first();
      if (existingRating) {
        return {
          result: false,
        };
      } else {
        const result = await this.knex('rating').insert({
          user_id1: body.user_id,
          user_id2: user_id,
          post_id: post_id,
        });
        if (result !== undefined) {
          return { result: true };
        } else {
          return { result: false };
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
