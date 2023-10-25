import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('system_location', (table) => {
    table.specificType('latitude', 'real').notNullable().alter();
    table.specificType('longitude', 'real').notNullable().alter();
  });
  await knex.schema.alterTable('user_location', (table) => {
    table.specificType('latitude', 'real').nullable().alter();
    table.specificType('longitude', 'real').nullable().alter();
  });
  await knex.schema.alterTable('daily_event', (table) => {
    table.dropColumn('start_time');
    table.dropColumn('end_time');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('daily_event').delete();
  await knex.schema.alterTable('daily_event', (table) => {
    table.integer('end_time').notNullable();
    table.integer('start_time').notNullable();
  });
  await knex.schema.alterTable('user_location', (table) => {
    table.decimal('longitude').nullable().alter();
    table.decimal('latitude').nullable().alter();
  });
  await knex.schema.alterTable('system_location', (table) => {
    table.decimal('longitude').notNullable().alter();
    table.decimal('latitude').notNullable().alter();
  });
}
