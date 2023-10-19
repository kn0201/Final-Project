import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('hashtags', 'post_hashtag')
  await knex.schema.alterTable('post', table => {
    table.setNullable('headcount')
    table.setNullable('status')
    table.setNullable('country')
  })
  await knex.schema.alterTable('system_location', table => {
    table.decimal('latitude').notNullable().alter()
    table.decimal('longitude').notNullable().alter()
  })
  await knex.schema.alterTable('user_location', table => {
    table.decimal('latitude').nullable().alter()
    table.decimal('longitude').nullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_location', table => {
    table.decimal('longitude').nullable().alter()
    table.decimal('latitude').nullable().alter()
  })
  await knex.schema.alterTable('system_location', table => {
    table.decimal('longitude').notNullable().alter()
    table.decimal('latitude').notNullable().alter()
  })
  await knex.schema.alterTable('post', table => {
    table.dropNullable('country')
    table.dropNullable('status')
    table.dropNullable('headcount')
  })
  await knex.schema.renameTable('post_hashtag', 'hashtags')
}
