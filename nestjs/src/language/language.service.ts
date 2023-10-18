import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

@Injectable()
export class LanguageService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getLanguageList() {
    let result = await this.knex('language').select('id', 'name');

    return result;
  }
}
