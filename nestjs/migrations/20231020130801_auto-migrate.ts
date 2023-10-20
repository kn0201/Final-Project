import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('planing', 'plan')
  await knex.schema.alterTable('rating', table => {
    table.dropForeign('planing_id')
    table.foreign('planing_id').references('plan.id')
    table.renameColumn('planing_id', 'plan_id')
  })
  await knex.schema.alterTable('plan_detail', table => {
    table.dropForeign('planing_id')
    table.foreign('planing_id').references('plan.id')
    table.renameColumn('planing_id', 'plan_id')
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
  await knex.schema.alterTable('plan_detail', table => {
    table.renameColumn('plan_id', 'planing_id')
    table.dropForeign('planing_id')
    table.foreign('planing_id').references('planing.id')
  })
  await knex.schema.alterTable('rating', table => {
    table.renameColumn('plan_id', 'planing_id')
    table.dropForeign('planing_id')
    table.foreign('planing_id').references('planing.id')
  })
  await knex.schema.renameTable('plan', 'planing')
}
