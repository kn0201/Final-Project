import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('rating', table => {
    table.dropColumn('application_id')
    table.integer('post_id').unsigned().notNullable().references('post.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('rating', table => {
    table.dropColumn('post_id')
    table.integer('application_id').unsigned().notNullable().references('application.id')
  })
}
