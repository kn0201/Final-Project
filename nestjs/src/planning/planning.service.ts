import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}
    async getPlanning(req) {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;

      let title = await this.knex('planing')
        .select('title','image_id' )
        .where('id', user_id)
        .first();
      console.log(title);

      return {
        title: title,
        image: image_id,
      };
    }

  async addPlanning(input, req) {
      const payload = this.jwtService.decode(
          req.headers.authorization.split(' ')[1],
        );
        let user_id = payload.user_id;

    let plan = await this.knex('planing')
    .select('title')
    .where({id: user_id}).update({
      (title:title)
      
    })
    .first()
  }
}
