import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.decimal('rating').notNullable().alter()
    table.text('intro').nullable()
    table.integer('avatar_id').unsigned().nullable().references('image.id')
  })
  await knex.schema.alterTable('planing', table => {
    table.integer('image_id').unsigned().nullable().references('image.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('planing', table => {
    table.dropColumn('image_id')
  })
  await knex.schema.alterTable('users', table => {
    table.dropColumn('avatar_id')
    table.dropColumn('intro')
    table.decimal('rating').notNullable().alter()
  })
}
