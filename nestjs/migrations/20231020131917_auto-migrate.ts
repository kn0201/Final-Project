import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_event', (table) => {
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('daily_event', (table) => {
    table.dropColumn('end_time');
    table.dropColumn('start_time');
  });
}
