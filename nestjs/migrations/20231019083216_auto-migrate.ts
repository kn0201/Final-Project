import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('rating'))) {
    await knex.schema.createTable('rating', table => {
      table.increments('id')
      table.integer('user1_id').unsigned().notNullable().references('users.id')
      table.integer('user2_id').unsigned().notNullable().references('users.id')
      table.integer('planing_id').unsigned().notNullable().references('planing.id')
      table.timestamps(false, true)
    })
  }
  await knex.schema.alterTable('system_location', table => {
    table.decimal('latitude').notNullable().alter()
    table.decimal('longitude').notNullable().alter()
  })
  await knex.schema.alterTable('user_location', table => {
    table.decimal('latitude').nullable().alter()
    table.decimal('longitude').nullable().alter()
    table.string('name', 255).nullable()
    table.string('address', 255).nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_location', table => {
    table.dropColumn('address')
    table.dropColumn('name')
    table.decimal('longitude').nullable().alter()
    table.decimal('latitude').nullable().alter()
  })
  await knex.schema.alterTable('system_location', table => {
    table.decimal('longitude').notNullable().alter()
    table.decimal('latitude').notNullable().alter()
  })
  await knex.schema.dropTableIfExists('rating')
}
