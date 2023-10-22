import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getLikeNumber(id) {
    try {
      let number_of_like = await this.knex
        .count('id')
        .from('like')
        .where('post_id', id)
        .first();
      console.log({ number_of_like });
      return {
        number_of_like: number_of_like.count ? number_of_like.count : 0,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getUserLikeStatus(id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const existingLike = await this.knex
        .select('id')
        .from('like')
        .where('user_id', user_id)
        .andWhere('post_id', id)
        .first();
      if (existingLike) {
        return { isLike: true };
      } else {
        return { isLike: false };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async like(id, body, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const existingLike = await this.knex
        .select('id')
        .from('like')
        .where('user_id', user_id)
        .andWhere('post_id', id)
        .first();
      if (existingLike) {
        await this.knex('like')
          .where({
            id: existingLike.id,
          })
          .del();
        let number_of_like = await this.knex
          .count('id')
          .from('like')
          .where('post_id', body.id)
          .first();
        return {
          number_of_like: number_of_like.count ? number_of_like.count : 0,
        };
      } else {
        await this.knex('like').insert({
          user_id: user_id,
          post_id: id,
        });
        let number_of_like = await this.knex
          .count('id')
          .from('like')
          .where('post_id', body.id)
          .first();
        return { number_of_like: number_of_like.count };
      }
    } catch (err) {
      console.log(err);
    }
  }
}
