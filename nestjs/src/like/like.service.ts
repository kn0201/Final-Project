import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class LikeService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getLikeNumber(id) {
    try {
      let number_of_like = await this.knex
        .count('id')
        .from('like')
        .where('post_id', id)
        .first();
      return {
        number_of_like: number_of_like.count || 0,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getUserLikeStatus(id, user_id) {
    try {
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

  async like(id, body, user_id) {
    try {
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
          number_of_like: number_of_like.count || 0,
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
