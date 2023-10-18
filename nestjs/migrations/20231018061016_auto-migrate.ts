import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('language', 'user_language')
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('user_language', 'language')
}
