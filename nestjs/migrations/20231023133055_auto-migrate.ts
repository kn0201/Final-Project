import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_event', table => {
    table.dropColumn('detail_id')
    table.integer('plan_id').unsigned().notNullable().references('plan.id')
    table.timestamp('selected_date').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_event', table => {
    table.dropColumn('selected_date')
    table.dropColumn('plan_id')
    table.integer('detail_id').unsigned().notNullable().references('plan_detail.id')
  })
}
