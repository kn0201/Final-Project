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

    let result = await this.knex('users')
      .select('intro', 'language', 'skill', 'hobby', 'countries_travelled')
      .where('id', user_id)
      .first();

    return result;
  }

  async sendProfile(input, req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;
    await this.knex('users').where({ id: user_id }).update({
      intro: input.intro,
      language: input.language,
      skill: input.skill,
      hobby: input.hobby,
      countries_travelled: input.country,
    });

    return { result: true };
  }
}
