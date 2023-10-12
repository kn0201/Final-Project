import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', table => {
      table.increments('id')
      table.string('username', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.boolean('gender').notNullable()
      table.string('age', 255).notNullable()
      table.string('country', 255).notNullable()
      table.decimal('rating').notNullable()
      table.string('language', 255).nullable()
      table.string('skill', 255).nullable()
      table.string('hobby', 255).nullable()
      table.string('countries_travelled', 255).nullable()
      table.string('role', 255).notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('system_location'))) {
    await knex.schema.createTable('system_location', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.point('location').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('post'))) {
    await knex.schema.createTable('post', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.boolean('privacy').notNullable()
      table.string('type', 255).notNullable()
      table.string('title', 255).notNullable()
      table.string('content', 255).notNullable()
      table.integer('location_id').unsigned().nullable().references('system_location.id')
      table.string('time', 255).nullable()
      table.string('headcount', 255).nullable()
      table.string('budget', 255).nullable()
      table.string('status', 255).notNullable()
      table.string('age', 255).nullable()
      table.boolean('gender').nullable()
      table.string('country', 255).notNullable()
      table.integer('view').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('chatroom'))) {
    await knex.schema.createTable('chatroom', table => {
      table.increments('id')
      table.integer('user1_id').unsigned().notNullable().references('users.id')
      table.integer('user2_id').unsigned().notNullable().references('users.id')
      table.boolean('user1_is_delete').notNullable()
      table.boolean('user2_is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('chat_record'))) {
    await knex.schema.createTable('chat_record', table => {
      table.increments('id')
      table.integer('chatroom_id').unsigned().notNullable().references('chatroom.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.string('message', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('comment'))) {
    await knex.schema.createTable('comment', table => {
      table.increments('id')
      table.integer('post_id').unsigned().notNullable().references('post.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.text('content').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('image'))) {
    await knex.schema.createTable('image', table => {
      table.increments('id')
      table.integer('post_id').unsigned().nullable().references('post.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('comment_id').unsigned().nullable().references('comment.id')
      table.text('path').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('application'))) {
    await knex.schema.createTable('application', table => {
      table.increments('id')
      table.integer('post_id').unsigned().notNullable().references('post.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.boolean('status').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('like'))) {
    await knex.schema.createTable('like', table => {
      table.increments('id')
      table.integer('post_id').unsigned().notNullable().references('post.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('bookmark'))) {
    await knex.schema.createTable('bookmark', table => {
      table.increments('id')
      table.integer('post_id').unsigned().notNullable().references('post.id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('complaint'))) {
    await knex.schema.createTable('complaint', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.string('title', 255).notNullable()
      table.text('content').notNullable()
      table.boolean('is_finish').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('planing'))) {
    await knex.schema.createTable('planing', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.boolean('privacy').notNullable()
      table.string('title', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('plan_detail'))) {
    await knex.schema.createTable('plan_detail', table => {
      table.increments('id')
      table.integer('planing_id').unsigned().notNullable().references('planing.id')
      table.timestamp('date').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('daily_event'))) {
    await knex.schema.createTable('daily_event', table => {
      table.increments('id')
      table.integer('detail_id').unsigned().notNullable().references('plan_detail.id')
      table.timestamp('time').notNullable()
      table.string('location', 255).notNullable()
      table.string('remark', 255).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('user_location'))) {
    await knex.schema.createTable('user_location', table => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('users.id')
      table.integer('post_id').unsigned().nullable().references('post.id')
      table.integer('image_id').unsigned().nullable().references('image.id')
      table.integer('system_location_id').unsigned().nullable().references('system_location.id')
      table.point('location').notNullable()
      table.boolean('is_delete').notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('hashtags'))) {
    await knex.schema.createTable('hashtags', table => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.integer('post_id').unsigned().notNullable().references('post.id')
      table.timestamps(false, true)
    })
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('hashtags')
  await knex.schema.dropTableIfExists('user_location')
  await knex.schema.dropTableIfExists('daily_event')
  await knex.schema.dropTableIfExists('plan_detail')
  await knex.schema.dropTableIfExists('planing')
  await knex.schema.dropTableIfExists('complaint')
  await knex.schema.dropTableIfExists('bookmark')
  await knex.schema.dropTableIfExists('like')
  await knex.schema.dropTableIfExists('application')
  await knex.schema.dropTableIfExists('image')
  await knex.schema.dropTableIfExists('comment')
  await knex.schema.dropTableIfExists('chat_record')
  await knex.schema.dropTableIfExists('chatroom')
  await knex.schema.dropTableIfExists('post')
  await knex.schema.dropTableIfExists('system_location')
  await knex.schema.dropTableIfExists('users')
}
