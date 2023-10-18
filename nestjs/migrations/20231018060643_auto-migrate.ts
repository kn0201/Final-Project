import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('plan_detail', (table) => {
    table.dropColumn('date');
    table.timestamp('start_date').notNullable();
    table.timestamp('end_date').notNullable();
  });
  await knex.schema.alterTable('daily_event', (table) => {
    table.dropColumn('time');
    table.integer('start_time').notNullable();
    table.integer('end_time').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_event', (table) => {
    table.dropColumn('end_time');
    table.dropColumn('start_time');
    table.timestamp('time').notNullable();
  });
  await knex.schema.alterTable('plan_detail', (table) => {
    table.dropColumn('end_date');
    table.dropColumn('start_date');
    table.timestamp('date').notNullable();
  });
}
