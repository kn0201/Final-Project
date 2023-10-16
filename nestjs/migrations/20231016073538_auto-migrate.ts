import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('country_list'))) {
    await knex.schema.createTable('country_list', table => {
      table.increments('id')
      table.string('code', 255).notNullable()
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }
  await knex.schema.alterTable('users', table => {
    table.dropColumn('countries_travelled')
    table.dropColumn('hobby')
    table.dropColumn('skill')
    table.dropColumn('language')
    table.dropColumn('country')
    table.decimal('rating').notNullable().alter()
    table.integer('country_id').unsigned().notNullable().references('country_list.id')
  })

  if (!(await knex.schema.hasTable('language_list'))) {
    await knex.schema.createTable('language_list', table => {
      table.increments('id')
      table.string('code', 255).notNullable()
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('language'))) {
    await knex.schema.createTable('language', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('language_id').unsigned().notNullable().references('language_list.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('countries_travelled'))) {
    await knex.schema.createTable('countries_travelled', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('country_id').unsigned().notNullable().references('country_list.id')
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

  if (!(await knex.schema.hasTable('skill'))) {
    await knex.schema.createTable('skill', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('skill_list').unsigned().notNullable().references('skill_list.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hobby_list'))) {
    await knex.schema.createTable('hobby_list', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hobby'))) {
    await knex.schema.createTable('hobby', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('hobby_list_id').unsigned().notNullable().references('hobby_list.id')
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('hobby')
  await knex.schema.dropTableIfExists('hobby_list')
  await knex.schema.dropTableIfExists('skill')
  await knex.schema.dropTableIfExists('skill_list')
  await knex.schema.dropTableIfExists('countries_travelled')
  await knex.schema.dropTableIfExists('language')
  await knex.schema.dropTableIfExists('language_list')
  await knex.schema.alterTable('users', table => {
    table.dropColumn('country_id')
    table.decimal('rating').notNullable().alter()
    table.string('country', 255).notNullable()
    table.string('language', 255).nullable()
    table.string('skill', 255).nullable()
    table.string('hobby', 255).nullable()
    table.string('countries_travelled', 255).nullable()
  })
  await knex.schema.dropTableIfExists('country_list')
}
