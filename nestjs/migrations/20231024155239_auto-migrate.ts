import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('application', table => {
    table.boolean('confirm').nullable()
  })
  await knex.schema.alterTable('rating', table => {
    table.setNullable('plan_id')
    table.integer('application_id').unsigned().notNullable().references('application.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('rating', table => {
    table.dropColumn('application_id')
    table.dropNullable('plan_id')
  })
  await knex.schema.alterTable('application', table => {
    table.dropColumn('confirm')
  })
}
