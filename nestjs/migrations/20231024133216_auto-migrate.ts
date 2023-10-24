import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('system_location', table => {
    table.unique(['place_id'])
  })
  await knex.schema.alterTable('chatroom', table => {
    table.dropColumn('user2_is_delete')
    table.dropColumn('user1_is_delete')
    table.dropColumn('user2_id')
    table.dropColumn('user1_id')
    table.string('title', 255).notNullable()
    table.integer('post_id').unsigned().notNullable().references('post.id')
    table.integer('plan_id').unsigned().nullable().references('plan.id')
  })

  if (!(await knex.schema.hasTable('chat_member'))) {
    await knex.schema.createTable('chat_member', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('chatroom_id').unsigned().notNullable().references('chatroom.id')
      table.timestamps(false, true)
    })
  }
  await knex.schema.alterTable('chat_record', table => {
    table.dropColumn('user_id')
    table.dropColumn('chatroom_id')
    table.integer('member_id').unsigned().notNullable().references('chat_member.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chat_record', table => {
    table.dropColumn('member_id')
    table.integer('chatroom_id').unsigned().notNullable().references('chatroom.id')
    table.integer('user_id').unsigned().notNullable().references('users.id')
  })
  await knex.schema.dropTableIfExists('chat_member')
  await knex.schema.alterTable('chatroom', table => {
    table.dropColumn('plan_id')
    table.dropColumn('post_id')
    table.dropColumn('title')
    table.integer('user1_id').unsigned().notNullable().references('users.id')
    table.integer('user2_id').unsigned().notNullable().references('users.id')
    table.boolean('user1_is_delete').notNullable()
    table.boolean('user2_is_delete').notNullable()
  })
  await knex.schema.alterTable('system_location', table => {
    table.dropUnique(['place_id'])
  })
}
