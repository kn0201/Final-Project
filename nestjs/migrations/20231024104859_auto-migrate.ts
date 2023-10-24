import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('post', table => {
    table.setNullable('title')
    table.text('content').notNullable().alter()
    table.integer('system_location_id').unsigned().nullable().references('system_location.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('post', table => {
    table.dropColumn('system_location_id')
    table.string('content', 255).notNullable().alter()
    table.dropNullable('title')
  })
}
