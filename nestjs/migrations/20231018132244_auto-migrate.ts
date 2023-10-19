import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('system_location', table => {
    table.dropColumn('location')
    table.decimal('latitude').notNullable()
    table.decimal('longitude').notNullable()
  })
  await knex.schema.alterTable('user_location', table => {
    table.dropColumn('location')
    table.string('place_id', 255).nullable()
    table.decimal('latitude').nullable()
    table.decimal('longitude').nullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_location', table => {
    table.dropColumn('longitude')
    table.dropColumn('latitude')
    table.dropColumn('place_id')
    table.point('location').notNullable()
  })
  await knex.schema.alterTable('system_location', table => {
    table.dropColumn('longitude')
    table.dropColumn('latitude')
    table.point('location').notNullable()
  })
}
