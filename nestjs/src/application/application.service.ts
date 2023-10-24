import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getApplicationList(id: number) {
    try {
      let applications = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .leftJoin('application', { 'users.id': 'application.user_id' })
        .select(
          'application.id as id',
          'users.id as user_id',
          'users.username as username',
          'image.path as avatar_path',
          'application.status as status',
          'application.created_at as created_at',
        )
        .where('application.post_id', id)
        .andWhere('application.status', true)
        .orderBy('application.created_at', 'asc');
      return applications;
    } catch (err) {
      console.log(err);
    }
  }

  async getApplicationStatus(id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      let application = await this.knex('application')
        .select('id')
        .where('post_id', id)
        .andWhere('user_id', user_id)
        .first();
      if (application === undefined) {
        return { status: false };
      }
      return { status: true };
    } catch (err) {
      console.log(err);
    }
  }

  async getUserAcceptStatus(post_id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      let application = await this.knex('application')
        .select('status')
        .where('post_id', post_id)
        .andWhere('user_id', user_id)
        .first();
      if (application === undefined) {
        return { status: null };
      }
      return { status: application.status };
    } catch (err) {
      console.log(err);
    }
  }

  async getAppliedUsers(id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      let appliedUsersInfo = [];
      let postUser = await this.knex('post')
        .select('user_id')
        .where('id', id)
        .andWhere('user_id', user_id);
      if (!postUser) {
        throw new Error('User not authorized');
      } else {
        let appliedUsers = await this.knex('users')
          .leftJoin('image', { 'users.avatar_id': 'image.id' })
          .leftJoin('application', { 'users.id': 'application.user_id' })
          .select(
            'application.id as id',
            'users.id as user_id',
            'users.username as username',
            'image.path as avatar_path',
            'users.rating as rating',
            'application.status as status',
            'application.created_at as created_at',
          )
          .where('application.post_id', id)
          .orderBy('application.created_at', 'asc');
        for (let appliedUser of appliedUsers) {
          let number_of_rating = await this.knex
            .count('id')
            .from('rating')
            .where('user1_id', appliedUser.user_id)
            .first();
          appliedUsersInfo.push({
            id: appliedUser.id,
            user_id: appliedUser.user_id,
            username: appliedUser.username,
            avatar_path: appliedUser.avatar_path,
            rating: appliedUser.rating,
            number_of_rating: +number_of_rating.count,
            status: appliedUser.status,
            created_at: appliedUser.created_at,
          });
        }
        console.log(appliedUsersInfo);
        return appliedUsersInfo;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getConfirmedUsersList(id, user_id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let login_user_id = payload.user_id;
      let confirmedUsersInfo = [];
      let postUser = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .select(
          'users.id as user_id',
          'users.username as username',
          'image.path as avatar_path',
          'users.rating as rating',
        )
        .where('user_id', user_id)
        .first();
      let number_of_rating_postUser = await this.knex
        .count('id')
        .from('rating')
        .where('user1_id', postUser.user_id)
        .first();
      confirmedUsersInfo.push({
        user_id: postUser.user_id,
        username: postUser.username,
        avatar_path: postUser.avatar_path,
        rating: postUser.rating,
        number_of_rating: +number_of_rating_postUser.count,
      });
      let confirmedUsers = await this.knex('users')
        .leftJoin('image', { 'users.avatar_id': 'image.id' })
        .leftJoin('application', { 'users.id': 'application.user_id' })
        .select(
          'users.id as user_id',
          'users.username as username',
          'image.path as avatar_path',
          'users.rating as rating',
        )
        .where('application.post_id', id)
        .andWhere('application.status', true)
        .orderBy('application.created_at', 'asc');
      for (let confirmedUser of confirmedUsers) {
        let number_of_rating_confirmedUser = await this.knex
          .count('id')
          .from('rating')
          .where('user1_id', confirmedUser.user_id)
          .first();
        confirmedUsersInfo.push({
          user_id: confirmedUser.user_id,
          username: confirmedUser.username,
          avatar_path: confirmedUser.avatar_path,
          rating: confirmedUser.rating,
          number_of_rating: +number_of_rating_confirmedUser.count,
        });
      }
      console.log(confirmedUsersInfo);
      return confirmedUsersInfo;
    } catch (err) {
      console.log(err);
    }
  }

  async acceptAppliedUsers(post_id, id, body, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const postUser = await this.knex
        .select('user_id', 'status', 'headcount')
        .from('post')
        .where('id', post_id)
        .first();
      if (postUser.user_id !== user_id) {
        throw new Error(
          `Unauthorized access to accept applications for tour #${post_id}`,
        );
      }
      const applicationStatus = await this.knex
        .select('status')
        .from('application')
        .where('post_id', post_id)
        .andWhere('user_id', id)
        .first();
      const number_of_accept_before = await this.knex
        .count('id')
        .from('application')
        .where('post_id', post_id)
        .andWhere('status', true)
        .first();
      if (applicationStatus.status === undefined) {
        throw new Error(
          `Do not have application record for user ${body.username}`,
        );
      }
      if (
        applicationStatus.status === false &&
        postUser.status === 'open' &&
        number_of_accept_before.count === postUser.headcount
      ) {
        throw new Error(
          `The targeted member number for the tour #${post_id} has been reached`,
        );
      }
      if (
        applicationStatus.status === false &&
        postUser.status === 'open' &&
        number_of_accept_before.count < postUser.headcount
      ) {
        let updatedStatus = await this.knex('application')
          .where('post_id', post_id)
          .andWhere('user_id', id)
          .update({ status: true });
        const number_of_accept_after = await this.knex
          .count('id')
          .from('application')
          .where('post_id', post_id)
          .andWhere('status', true)
          .first();
        if (number_of_accept_after.count == postUser.headcount) {
          let updatedPostStatus = await this.knex('post')
            .where('id', post_id)
            .update({ status: 'complete' });
        }
        return { status: true };
      }
      if (
        applicationStatus.status === true &&
        postUser.status !== 'close' &&
        number_of_accept_before.count <= postUser.headcount
      ) {
        let updatedStatus = await this.knex('application')
          .where('post_id', post_id)
          .andWhere('user_id', id)
          .update({ status: false });
        const number_of_accept_after = await this.knex
          .count('id')
          .from('application')
          .where('post_id', post_id)
          .andWhere('status', true)
          .first();
        if (number_of_accept_after.count == +postUser.headcount - 1) {
          let updatedPostStatus = await this.knex('post')
            .where('id', post_id)
            .update({ status: 'open' });
        }
        return { status: false };
      } else {
        throw new Error(`Please contact the administrator`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async applyTour(id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const postStatus = await this.knex
        .select('status')
        .from('post')
        .where('id', id)
        .first();
      const existingApplication = await this.knex
        .select('id', 'status')
        .from('application')
        .where('user_id', user_id)
        .andWhere('post_id', id)
        .first();
      if (existingApplication && postStatus.status === 'open') {
        await this.knex('application')
          .where({
            id: existingApplication.id,
          })
          .del();
        return {};
      } else if (!existingApplication && postStatus.status === 'open') {
        await this.knex('application').insert({
          user_id: user_id,
          post_id: id,
          status: false,
        });
        return {};
      } else {
        throw new Error('Please contact the tour organizer');
      }
    } catch (err) {
      console.log(err);
    }
  }
}
