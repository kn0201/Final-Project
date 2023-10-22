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
        .andWhere('application.status', true);
      return applications;
    } catch (err) {
      throw err;
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
