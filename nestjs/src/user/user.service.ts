import { Injectable } from '@nestjs/common';
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

  async updateUsername(input: { username: string }, headers) {
    const payload = this.jwtService.decode(headers.authorization.split(' ')[1]);
    let user_id = payload.user_id;

    let result = await this.knex('users')
      .update({
        username: input.username,
      })
      .where('id', user_id);

    if (result) {
      return { result: true };
    }
  }
}
