import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('hashtag'))) {
    await knex.schema.createTable('hashtag', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }
  await knex.schema.alterTable('post_hashtag', table => {
    table.dropColumn('name')
    table.integer('hashtag_id').unsigned().notNullable().references('hashtag.id')
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
  await knex.schema.alterTable('post_hashtag', table => {
    table.dropColumn('hashtag_id')
    table.string('name', 255).notNullable()
  })
  await knex.schema.dropTableIfExists('hashtag')
}
