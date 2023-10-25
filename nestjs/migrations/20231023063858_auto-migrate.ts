import { Knex } from 'knex';

export async function up(knex: Knex) {
  //   await knex.schema.alterTable('daily_event', (table) => {
  //     table.integer('plan_id').unsigned().notNullable().references('plan.id');
  //     table.timestamp('selected_date').notNullable();
  //     table.dropColumn('detail_id');
  //   });
}

export async function down(knex: Knex) {
  //   await knex.schema.alterTable('daily_event', (table) => {
  //     table.dropColumn('plan_id');
  //     table.dropColumn('selected_date');
  //     table
  //       .integer('detail_id')
  //       .unsigned()
  //       .nullable()
  //       .references('plan_detail.id');
  //   });
}
