import { Injectable } from '@nestjs/common';
import { object } from 'cast.ts';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getProfile(req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;

    let intro = await this.knex('users')
      .select('intro')
      .where('id', user_id)
      .first();

    let language = await this.knex
      .select('language.name as name', 'language.id as id')
      .from('user_language')
      .where('user_id', user_id)
      .leftJoin('language', 'language.id', 'language_id');

    let hobby = await this.knex
      .select('hobby_list.name as name', 'hobby_list.id as id')
      .from('hobby')
      .where('user_id', user_id)
      .leftJoin('hobby_list', 'hobby_list.id', 'hobby_id');

    let countries_travelled = await this.knex
      .select('country_list.name as name', 'country_list.id as id')
      .from('countries_travelled')
      .where('user_id', user_id)
      .leftJoin('country_list', 'country_list.id', 'country_id');

    return {
      intro: intro.intro,
      language: language,
      hobby: hobby,
      countries_travelled: countries_travelled,
    };
  }

  async sendProfile(input, req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;
    await this.knex('users').where({ id: user_id }).update({
      intro: input.intro,
    });

    let country = input.country.split(',');
    let hobby = input.hobby.split(',');
    let language = input.language.split(',');

    for (let country_id of country) {
      let row = await this.knex
        .select('id')
        .from('countries_travelled')
        .where('user_id', user_id)
        .andWhere('country_id', country_id)
        .first();
      if (!row) {
        await this.knex('countries_travelled').insert({
          user_id: user_id,
          country_id: country_id,
        });
      }
    }

    for (let language_id of language) {
      let row = await this.knex
        .select('id')
        .from('user_language')
        .where('user_id', user_id)
        .andWhere('language_id', language_id)
        .first();
      if (!row) {
        await this.knex('user_language').insert({
          user_id: user_id,
          language_id: language_id,
        });
      }
    }

    for (let hobby_id of hobby) {
      let row = await this.knex
        .select('id')
        .from('hobby')
        .where('user_id', user_id)
        .andWhere('hobby_id', hobby_id)
        .first();
      if (!row) {
        await this.knex('hobby').insert({
          user_id: user_id,
          hobby_id: hobby_id,
        });
      }
    }

    return { result: true };
  }

  async getHobbyList() {
    let result = await this.knex('hobby_list').select('id', 'name');
    return result;
  }

  async getIcon(headers) {
    let token = headers.authorization.split(' ')[1];
    if (token == undefined) {
      return { path: 'yukimin.png' };
    } else {
      const payload = this.jwtService.decode(token);
      let user_id = payload.user_id;

      let avatar_id = await this.knex
        .select('avatar_id')
        .from('users')
        .where('users.id', user_id)
        .first();

      let result = await this.knex
        .select('image.path as path')
        .from('users')
        .where('user_id', user_id)
        .andWhere('image.id', avatar_id.avatar_id)
        .andWhere('image.is_delete', 'false')
        .leftJoin('image', 'user_id', user_id)
        .first();

      // console.log(result);
      if (result === undefined) {
        return { path: 'yukimin.png' };
      }
      return result;
    }
  }

  async updateIcon(image, req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;

    let imageName = image.filename;

    let avatar_id = await this.knex
      .select('avatar_id')
      .from('users')
      .where('users.id', user_id)
      .first();

    let path = await this.knex
      .select('image.path')
      .from('image')
      .where('image.id', avatar_id.avatar_id)
      .andWhere('image.user_id', user_id);

    let uploadResult = await this.knex('image')
      .insert({
        user_id: user_id,
        path: imageName,
        is_delete: false,
      })
      .returning('id');

    let image_id = uploadResult[0].id;

    await this.knex('users')
      .update({
        avatar_id: image_id,
      })
      .where('users.id', user_id);

    await this.knex('image')
      .update({
        is_delete: true,
      })
      .where('image.id', avatar_id.avatar_id);

    return { result: true };
  }

  async updateUsername(input: { user_id: number; username: string }) {
    let result = await this.knex('users')
      .update({
        username: input.username,
      })
      .where('id', input.user_id);
    console.log(result);

    if (result) {
      return { result: true };
    }
  }

  async getUserIcon(input: { user_id: number }) {
    try {
      let user_id = input.user_id;

      let user = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .select('image.path as avatar_path')
        .where('users.id', user_id)
        .andWhere('users.is_delete', false)
        .first();
      return { path: user.avatar_path };
    } catch (err) {
      console.log(err);
    }
  }

  async getOtherProfile(post_id, id, post_user_id) {
    try {
      let user = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .leftJoin('country_list', { 'users.country_id': 'country_list.id' })
        .select(
          'image.path as avatar_path',
          'users.rating',
          'users.intro',
          'users.gender',
          'users.age',
          'country_list.name as country',
        )
        .where('users.id', id)
        .andWhere('users.is_delete', false)
        .first();
      let language_results = await this.knex('user_language')
        .leftJoin('language', {
          'user_language.language_id': 'language.id',
        })
        .select('language.name as language')
        .where('user_language.user_id', id);
      let language = language_results.map((language_result) => {
        return language_result.language;
      });
      let hobby_results = await this.knex('hobby')
        .leftJoin('hobby_list', {
          'hobby.hobby_id': 'hobby_list.id',
        })
        .select('hobby_list.name as hobby')
        .where('hobby.user_id', id);
      let hobby = hobby_results.map((hobby_result) => {
        return hobby_result.hobby;
      });
      let travelled_results = await this.knex('countries_travelled')
        .leftJoin('country_list', {
          'countries_travelled.country_id': 'country_list.id',
        })
        .select('country_list.name as countrires_travelled')
        .where('countries_travelled.user_id', id);
      let countries_travelled = travelled_results.map((travelled_result) => {
        return travelled_result.countrires_travelled;
      });
      let number_of_rating = await this.knex
        .count('id')
        .from('rating')
        .where('user1_id', id)
        .first();
      let application_status = await this.knex('application')
        .select('status', 'confirm')
        .where('post_id', post_id)
        .andWhere('user_id', id)
        .first();
      if (application_status == undefined) {
        return {
          avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
          rating: +user.rating,
          intro: user.intro,
          gender: user.gender,
          age: user.age,
          country: user.country,
          language: language,
          hobby: hobby,
          countries_travelled: countries_travelled,
          number_of_rating: +number_of_rating.count,
          application_status: null,
          confirm_status: null,
        };
      }
      return {
        avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
        rating: +user.rating,
        intro: user.intro,
        gender: user.gender,
        age: user.age,
        country: user.country,
        language: language,
        hobby: hobby,
        countries_travelled: countries_travelled,
        number_of_rating: +number_of_rating.count,
        application_status: application_status.status,
        confirm_status: application_status.confirm,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getUserBookmark(input: { user_id: number }) {
    let postInfo = [];
    let list = await this.knex
      .select('post_id')
      .from('bookmark')
      .where('user_id', input.user_id);

    if (!list) {
      return [{ result: false }];
    } else {
      for (let bookmark of list) {
        let posts = await this.knex
          .select(
            'id',
            'user_id',
            'title',
            'country as trip_country',
            'time as trip_period',
            'status',
            'created_at',
          )
          .from('post')
          .where('id', bookmark.post_id)
          .andWhere('is_delete', false);

        for (let post of posts) {
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
            trip_country: post.trip_country,
            trip_period: post.trip_period,
            status: post.status,
            created_at: post.created_at,
            username: user.username,
            avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
            rating: +user.rating,
            number_of_rating: +number_of_rating.count,
            number_of_like: +number_of_like.count,
            number_of_reply: +number_of_reply.count,
            result: true,
          });
        }
      }
    }
    // console.log(postInfo);

    return postInfo;
  }

  async getOwnPost(input: { user_id: number }) {
    let postInfo = [];

    let posts = await this.knex
      .select(
        'id',
        'user_id',
        'title',
        'country as trip_country',
        'time as trip_period',
        'status',
        'created_at',
      )
      .from('post')
      .where('user_id', input.user_id)
      .andWhere('is_delete', false);

    for (let post of posts) {
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
        trip_country: post.trip_country,
        trip_period: post.trip_period,
        status: post.status,
        created_at: post.created_at,
        username: user.username,
        avatar_path: user.avatar_path ? user.avatar_path : 'yukimin.png',
        rating: +user.rating,
        number_of_rating: +number_of_rating.count,
        number_of_like: +number_of_like.count,
        number_of_reply: +number_of_reply.count,
        result: true,
      });
    }
    // console.log(postInfo);

    return postInfo;
  }

  async getNewPost(input: { user_id: number | null }) {
    let type_result = await this.knex
      .select('type', 'id')
      .from('post')
      .where('is_delete', false)
      .orderBy('created_at', 'desc')
      .first();

    console.log(type_result);
    if (type_result.type == 'enquire') {
      let postInfo = [];
      let post_results = await this.knex
        .select('id', 'user_id', 'title', 'content', 'created_at')
        .from('post')
        .where('id', type_result.id);

      if (post_results.length > 0) {
        for (let post of post_results) {
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
            type: type_result.type,
            id: post.id,
            title: post.title,
            content: post.content,
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
    } else if (type_result.type == 'tour') {
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
        .where('id', type_result.id);
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
            type: type_result.type,
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
    } else if (type_result.type == 'snap') {
      let results = await this.knex
        .select(
          'post.id as post_id',
          'post.user_id',
          'users.username as username',
          'post.content',
          'post.created_at',
          'system_location.name as location_name',
          'image.path as image_path',
          'users.avatar_id as avatar_id',
        )
        .from('post')
        .where('id', type_result.id)
        .leftJoin('users', 'post.user_id', 'users.id')
        .leftJoin(
          'system_location',
          'post.system_location_id',
          'system_location.id',
        )
        .leftJoin('image', 'image.post_id', 'post.id');

      for (let result of results) {
        let avatar_path = await this.knex
          .select('image.path as avatar_path')
          .from('image')
          .where('image.id', result.avatar_id)
          .first();

        let likeCount = await this.knex
          .count('id')
          .from('like')
          .where('post_id', result.post_id)
          .first();
        if (input.user_id) {
          let isLike = await this.knex
            .count('id')
            .from('like')
            .where('post_id', result.post_id)
            .andWhere('user_id', input.user_id)
            .first();

          if (isLike.count == 0) {
            Object.assign(result, { isLike: false });
          } else {
            Object.assign(result, { isLike: true });
          }
        } else {
          Object.assign(result, { isLike: false });
        }
        Object.assign(result, { type: type_result.type });
        Object.assign(result, { likeCount: +likeCount.count });
        Object.assign(result, avatar_path);
        // console.log(result);
      }

      return results;
    }
  }
  return;
}
