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

  async getProfile() {
    let result = await this.knex('users')
      .select('intro', 'language', 'skill', 'hobby', 'countries_travelled')
      .where('id', 1);

    return { result };
  }

  async sendProfile(input) {
    await this.knex('users').update({
      intro: input.intro,
      language: input.language,
      skill: input.skill,
      hobby: input.hobby,
      countries_travelled: input.countries_travelled,
    });

    return { result: true };
  }
}
