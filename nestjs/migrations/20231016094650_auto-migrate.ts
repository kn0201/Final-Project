import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.decimal('rating').notNullable().alter()
  })
  await knex.schema.alterTable('skill', table => {
    table.dropColumn('skill_list')
    table.integer('skill_id').unsigned().notNullable().references('skill_list.id')
  })
  await knex.schema.alterTable('hobby', table => {
    table.dropColumn('hobby_list_id')
    table.integer('hobby_id').unsigned().notNullable().references('hobby_list.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('hobby', table => {
    table.dropColumn('hobby_id')
    table.integer('hobby_list_id').unsigned().notNullable().references('hobby_list.id')
  })
  await knex.schema.alterTable('skill', table => {
    table.dropColumn('skill_id')
    table.integer('skill_list').unsigned().notNullable().references('skill_list.id')
  })
  await knex.schema.alterTable('users', table => {
    table.decimal('rating').notNullable().alter()
  })
}
