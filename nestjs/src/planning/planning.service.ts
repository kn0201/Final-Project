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
  //   async getPlanning(req) {
  //     const payload = this.jwtService.decode(
  //       req.headers.authorization.split(' ')[1],
  //     );
  //     let user_id = payload.user_id;

  //     let intro = await this.knex('users')
  //       .select('intro')
  //       .where('id', user_id)
  //       .first();
  //     console.log(intro);

  //     let title = await this.knex('title')
  //       .select('title')
  //       .where('id', user_id)
  //       .first();
  //     console.log(title);

  //     let image = await this.knex('image')
  //       .select('image_id')
  //       .where('id', user_id)
  //       .first();
  //     console.log(image);

  //     let country = await this.knex('country')
  //       .select('country')
  //       .where('id', user_id)
  //       .first();
  //     console.log(country);

  //     return {
  //       intro: intro.intro,
  //       title: title,
  //       image: image,
  //       country: country,
  //     };
  //   }

  // async addPlanning(input, req) {
  //     const payload = this.jwtService.decode(
  //         req.headers.authorization.split(' ')[1],
  //       );
  //       let user_id = payload.user_id;
  //       await this.knex('users').where({ id: user_id }).update({
  //         intro: input.intro,
  //       });

  //   let plan = await this.knex('planing')
  //   .select('title')
  //   .where({id: user_id}).update({

  //   })
  //   .first()
  // }
}
