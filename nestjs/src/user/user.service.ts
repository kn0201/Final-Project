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
    console.log(intro);

    let language = await this.knex
      .select('language_list.name as name', 'language_list.id as id')
      .from('language')
      .where('user_id', user_id)
      .leftJoin('language_list', 'language_list.id', 'language_id');
    console.log({ language: language });

    let hobby = await this.knex
      .select('hobby_list.name as name', 'hobby_list.id as id')
      .from('hobby')
      .where('user_id', user_id)
      .leftJoin('hobby_list', 'hobby_list.id', 'hobby_id');
    console.log({ hobby: hobby });

    let countries_travelled = await this.knex
      .select('country_list.name as name', 'country_list.id as id')
      .from('countries_travelled')
      .where('user_id', user_id)
      .leftJoin('country_list', 'country_list.id', 'country_id');
    console.log({ countries_travelled: countries_travelled });

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
        .from('language')
        .where('user_id', user_id)
        .andWhere('language_id', language_id)
        .first();
      if (!row) {
        await this.knex('language').insert({
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
          hobby_list_id: hobby_id,
        });
      }
    }

    return { result: true };
  }

  async getLanguageList() {
    let result = await this.knex('language_list').select('id', 'name');

    return result;
  }
  async getHobbyList() {
    let result = await this.knex('hobby_list').select('id', 'name');
    return result;
  }

  async uploadImage(image) {
    let imageName = image.filename;
    let result = await this.knex;
  }
}
