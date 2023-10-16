import { readFileSync } from 'fs';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  let countries = JSON.parse(readFileSync('source/countries.json').toString());

  for (let country of countries) {
    let row = await knex
      .select('id')
      .from('country_list')
      .where('name', country.name)
      .first();
    if (!row) {
      await knex.insert(country).into('country_list');
      continue;
    }
    await knex.update(country).from('country_list').where('id', row.id);
  }

  let languages = JSON.parse(readFileSync('source/languages.json').toString());

  for (let language of languages) {
    let row = await knex
      .select('id')
      .from('language_list')
      .where('name', language.name)
      .first();
    if (!row) {
      await knex.insert(language).into('language_list');
      continue;
    }
    await knex.update(language).from('language_list').where('id', row.id);
  }
}
