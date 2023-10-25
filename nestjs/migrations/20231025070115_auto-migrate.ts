import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('tour_plan'))) {
    await knex.schema.createTable('tour_plan', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('plan_id').unsigned().notNullable().references('plan.id')
      table.integer('post_id').unsigned().nullable().references('post.id')
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tour_plan')
}
