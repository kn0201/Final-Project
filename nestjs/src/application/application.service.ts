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
