import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('skill')
  await knex.schema.dropTableIfExists('skill_list')
  await knex.schema.alterTable('post', table => {
    table.dropColumn('location_id')
    table.dropColumn('privacy')
    table.dropNullable('headcount')
    table.string('language', 255).nullable()
    table.string('hobby', 255).nullable()
  })
  await knex.schema.alterTable('users', table => {
    table.decimal('rating').notNullable().alter()
  })
  await knex.schema.alterTable('system_location', table => {
    table.string('place_id', 255).notNullable()
    table.string('address', 255).notNullable()
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
  await knex.schema.alterTable('system_location', table => {
    table.dropColumn('address')
    table.dropColumn('place_id')
  })
  await knex.schema.alterTable('users', table => {
    table.decimal('rating').notNullable().alter()
  })
  await knex.schema.alterTable('post', table => {
    table.dropColumn('hobby')
    table.dropColumn('language')
    table.setNullable('headcount')
    table.boolean('privacy').notNullable()
    table.integer('location_id').unsigned().nullable().references('system_location.id')
  })

  if (!(await knex.schema.hasTable('skill'))) {
    await knex.schema.createTable('skill', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('skill_list').unsigned().notNullable().references('skill_list.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('skill_list'))) {
    await knex.schema.createTable('skill_list', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }
}
