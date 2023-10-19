import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class CountryService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async getCountryList() {
    let result = await this.knex('country_list').select('id', 'name', 'code');

    return result;
  }
}
