import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getCommentInfo(id: number) {
    try {
      let commentInfo = [];
      let comment_results = await this.knex
        .select('id', 'user_id', 'content', 'created_at')
        .from('comment')
        .where('post_id', id)
        .andWhere('is_delete', false)
        .orderBy('created_at', 'asc');
      if (comment_results.length > 0) {
        for (let comment of comment_results) {
          let user = await this.knex('users')
            .leftJoin('image', { 'users.avatar_id': 'image.id' })
            .leftJoin('country_list', { 'users.country_id': 'country_list.id' })
            .select(
              'users.username',
              'image.path as avatar_path',
              'users.rating',
              'users.gender',
              'users.age',
              'country_list.name as country',
            )
            .where('users.id', comment.user_id)
            .andWhere('users.is_delete', false)
            .first();
          let language_results = await this.knex('user_language')
            .leftJoin('language', {
              'user_language.language_id': 'language.id',
            })
            .select('language.name as language')
            .where('user_language.user_id', comment.user_id);
          let language = language_results.map((language_result) => {
            return language_result.language;
          });
          let hobby_results = await this.knex('hobby')
            .leftJoin('hobby_list', {
              'hobby.hobby_id': 'hobby_list.id',
            })
            .select('hobby_list.name as hobby')
            .where('hobby.user_id', comment.user_id);
          let hobby = hobby_results.map((hobby_result) => {
            return hobby_result.hobby;
          });
          let travelled_results = await this.knex('countries_travelled')
            .leftJoin('country_list', {
              'countries_travelled.country_id': 'country_list.id',
            })
            .select('country_list.name as countrires_travelled')
            .where('countries_travelled.user_id', comment.user_id);
          let countries_travelled = travelled_results.map(
            (travelled_result) => {
              return travelled_result.countrires_travelled;
            },
          );
          let number_of_rating = await this.knex
            .count('id')
            .from('rating')
            .where('user1_id', comment.user_id)
            .first();
          await commentInfo.push({
            id: comment.id,
            content: comment.content,
            created_at: comment.created_at,
            username: user.username,
            avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
            rating: +user.rating,
            gender: user.gender,
            age: user.age,
            country: user.country,
            language: language,
            hobby: hobby,
            countries_travelled: countries_travelled,
            number_of_rating: +number_of_rating.count,
          });
        }
      }
      return commentInfo;
    } catch (err) {
      throw err;
    }
  }
}
