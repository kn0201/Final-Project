import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async addTourPost(body, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      let tour_post_result = await this.knex('post')
        .insert({
          user_id: user_id,
          type: body.type,
          title: body.title,
          content: body.content,
          country: body.trip_country,
          time: body.trip_period,
          headcount: body.trip_headcount,
          budget: body.trip_budget,
          gender: body.preferred_gender,
          age: body.preferred_age,
          language: body.preferred_language,
          hobby: body.preferred_hobby,
          status: body.type === 'tour' ? 'open' : '',
          view: 0,
          is_delete: false,
        })
        .returning('id');
      if (body.trip_location.length > 0) {
        for (let location of body.trip_location) {
          let system_location_record = await this.knex
            .select('id', 'place_id')
            .from('system_location')
            .where({
              place_id: location.place_id,
            })
            .first();
          let user_location_record = await this.knex
            .select('id', 'place_id')
            .from('user_location')
            .where({
              place_id: location.place_id,
            })
            .first();
          if (user_location_record === undefined) {
            if (system_location_record === undefined) {
              let system_location_result = await this.knex('system_location')
                .insert({
                  place_id: location.place_id,
                  name: location.name,
                  address: location.address,
                  latitude: location.latitude,
                  longitude: location.longitude,
                })
                .returning('id');
              await this.knex('user_location').insert({
                user_id: user_id,
                post_id: tour_post_result[0].id,
                system_location_id: system_location_result[0].id,
                place_id: location.place_id,
                is_delete: false,
              });
            } else {
              await this.knex('user_location').insert({
                user_id: user_id,
                post_id: tour_post_result[0].id,
                system_location_id: system_location_record.id,
                place_id: system_location_record.place_id,
                is_delete: false,
              });
            }
          }
        }
      }
      return { id: tour_post_result[0].id };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTourPostInfo() {
    try {
      let postInfo = [];
      let post_results = await this.knex
        .select(
          'id',
          'user_id',
          'title',
          'content',
          'country as trip_country',
          'time as trip_period',
          'headcount as trip_headcount',
          'budget as trip_budget',
          'gender as preferred_gender',
          'age as preferred_age',
          'language as preferred_language',
          'hobby as preferred_hobby',
          'status',
          'view',
          'created_at',
        )
        .from('post')
        .where('type', 'tour')
        .andWhere('is_delete', false)
        .orderBy('created_at', 'desc');
      if (post_results.length > 0) {
        for (let post of post_results) {
          let system_location_results = await this.knex('user_location')
            .leftJoin('post', { 'user_location.post_id': 'post.id' })
            .leftJoin('system_location', {
              'user_location.system_location_id': 'system_location.id',
            })
            .select(
              'system_location.name as name',
              'system_location.address as address',
              'system_location.latitude as latitude',
              'system_location.longitude as longitude',
            )
            .where('user_location.post_id', post.id);
          let user_location_results = await this.knex('user_location')
            .leftJoin('post', { 'user_location.post_id': 'post.id' })
            .select(
              'user_location.name as name',
              'user_location.address as address',
              'user_location.latitude as latitude',
              'user_location.longitude as longitude',
            )
            .where('user_location.post_id', post.id)
            .andWhere('user_location.system_location_id', null);
          let trip_location =
            system_location_results && !user_location_results
              ? [...system_location_results]
              : !system_location_results && user_location_results
              ? [...user_location_results]
              : system_location_results && user_location_results
              ? [...user_location_results, ...system_location_results]
              : [];
          let user = await this.knex('users')
            .leftJoin('image', { 'users.avatar_id': 'image.id' })
            .select(
              'users.username',
              'image.path as avatar_path',
              'users.rating',
            )
            .where('users.id', post.user_id)
            .first();
          let number_of_rating = await this.knex
            .count('id')
            .from('rating')
            .where('user1_id', post.user_id)
            .first();
          let number_of_like = await this.knex
            .count('id')
            .from('like')
            .where('post_id', post.id)
            .first();
          let number_of_reply = await this.knex
            .count('id')
            .from('comment')
            .where('post_id', post.id)
            .first();
          await postInfo.push({
            id: post.id,
            title: post.title,
            content: post.content,
            trip_country: post.trip_country,
            trip_location,
            trip_period: post.trip_period,
            trip_headcount: +post.trip_headcount,
            trip_budget: post.trip_budget,
            preferred_gender: post.preferred_gender,
            preferred_age: post.preferred_age,
            preferred_language: post.preferred_language,
            preferred_hobby: post.preferred_hobby,
            status: post.status,
            view: post.view,
            created_at: post.created_at,
            username: user.username,
            avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
            rating: +user.rating,
            number_of_rating: +number_of_rating.count,
            number_of_like: +number_of_like.count,
            number_of_reply: +number_of_reply.count,
          });
        }
      }
      return postInfo;
    } catch (err) {
      throw err;
    }
  }

  async getTourPostDetail(id: number) {
    try {
      let post = await this.knex
        .select(
          'id',
          'user_id',
          'title',
          'content',
          'country as trip_country',
          'time as trip_period',
          'headcount as trip_headcount',
          'budget as trip_budget',
          'gender as preferred_gender',
          'age as preferred_age',
          'language as preferred_language',
          'hobby as preferred_hobby',
          'status',
          'view',
          'created_at',
        )
        .from('post')
        .where('id', id)
        .first();
      let system_location_results = await this.knex('user_location')
        .leftJoin('post', { 'user_location.post_id': 'post.id' })
        .leftJoin('system_location', {
          'user_location.system_location_id': 'system_location.id',
        })
        .select(
          'system_location.name as name',
          'system_location.address as address',
          'system_location.latitude as latitude',
          'system_location.longitude as longitude',
        )
        .where('user_location.post_id', id);
      let user_location_results = await this.knex('user_location')
        .leftJoin('post', { 'user_location.post_id': 'post.id' })
        .select(
          'user_location.name as name',
          'user_location.address as address',
          'user_location.latitude as latitude',
          'user_location.longitude as longitude',
        )
        .where('user_location.post_id', id)
        .andWhere('user_location.system_location_id', null);
      let trip_location =
        system_location_results && !user_location_results
          ? [...system_location_results]
          : !system_location_results && user_location_results
          ? [...user_location_results]
          : system_location_results && user_location_results
          ? [...user_location_results, ...system_location_results]
          : [];
      let user = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .select('users.username', 'image.path as avatar_path', 'users.rating')
        .where('users.id', post.user_id)
        .first();
      let number_of_rating = await this.knex
        .count('id')
        .from('rating')
        .where('user1_id', post.user_id)
        .first();
      let number_of_like = await this.knex
        .count('id')
        .from('like')
        .where('post_id', id)
        .first();
      let number_of_reply = await this.knex
        .count('id')
        .from('comment')
        .where('post_id', id)
        .first();
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        trip_country: post.trip_country,
        trip_location,
        trip_period: post.trip_period,
        trip_headcount: +post.trip_headcount,
        trip_budget: post.trip_budget,
        preferred_gender: post.preferred_gender,
        preferred_age: post.preferred_age,
        preferred_language: post.preferred_language,
        preferred_hobby: post.preferred_hobby,
        status: post.status,
        view: post.view,
        created_at: post.created_at,
        username: user.username,
        avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
        rating: +user.rating,
        number_of_rating: +number_of_rating.count,
        number_of_like: +number_of_like.count,
        number_of_reply: +number_of_reply.count,
      };
    } catch (err) {
      throw err;
    }
  }
}
