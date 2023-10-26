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
      const userRating = await this.knex
        .select('rating')
        .from('users')
        .where('id', body.user_id)
        .first();
      console.log({ userRating });
      const existingRating = await this.knex
        .select('user1_id', 'user2_id', 'post_id')
        .from('rating')
        .where('user1_id', body.user_id)
        .andWhere('user2_id', user_id)
        .andWhere('post_id', post_id)
        .first();
      console.log({ existingRating });
      if (existingRating) {
        return {
          result: false,
        };
      } else {
        const result = await this.knex('rating')
          .insert({
            user1_id: body.user_id,
            user2_id: user_id,
            post_id: post_id,
            value: body.rating,
          })
          .returning('id');
        console.log({ result });
        const ratingValues = await this.knex
          .select('value')
          .from('rating')
          .where('user1_id', body.user_id);
        console.log({ ratingValues });
        const values = ratingValues.map((rating) => rating.value);
        const totalRatingValue = values.reduce((sum, value) => sum + value, 0);
        const number_of_rating = ratingValues.length;
        const averageRatingValue = totalRatingValue / number_of_rating;
        const updateUser = await this.knex('users')
          .where({ id: body.user_id })
          .update({ rating: averageRatingValue });
        if (result !== undefined) {
          console.log('insert');
          if (updateUser !== undefined) {
            console.log('update');
            return { result: true };
          }
        } else {
          return { result: false };
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
