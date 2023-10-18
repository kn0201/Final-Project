import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('language_list', 'language')
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('language', 'language_list')
}
