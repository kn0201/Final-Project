import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('rating', table => {
    table.integer('value').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('rating', table => {
    table.dropColumn('value')
  })
}
