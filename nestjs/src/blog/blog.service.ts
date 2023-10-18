import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async addTourPost(body, req) {
    const payload = this.jwtService.decode(
      req.headers.authorization.split(' ')[1],
    );
    let user_id = payload.user_id;
    let tour_post_result = await this.knex('post')
      .insert({
        user_id: user_id,
        type: body.type,
        title: body.title,
        content: body.content,
        country: body.trip_country,
        time: body.trip_period,
        headcount: body.trip_headcount,
        budget: body.trip_budget,
        gender: body.preferred_gender,
        age: body.preferred_age,
        language: body.preferred_language,
        hobby: body.preferred_hobby,
        status: 'open',
        view: 0,
        is_delete: false,
      })
      .returning('id');
    console.log({ tour_post_result });
    let tour_post_id = tour_post_result[0].id;
    for (let location of body.trip_location) {
      let system_location_record = await this.knex('system_location').where({
        place_id: location.id,
      });
      console.log({ system_location_record });
      if (system_location_record) {
        continue;
      } else {
        let system_location_result = await this.knex('system_location')
          .insert({
            place_id: location.id,
            name: location.name,
            address: location.address,
            location: location.coordinates,
          })
          .returning('id');
        console.log({ system_location_result });
        let system_location_id = system_location_result[0].id;
        let user_location_record = await this.knex('user_location').where({
          location: location.coordinates,
        });
        if (user_location_record) {
          continue;
        } else {
          let user_location_result = await this.knex('user_location')
            .insert({
              user_id: user_id,
              post_id: tour_post_id,
              system_location_id: system_location_id,
              location: location.coordinates,
              is_delete: false,
            })
            .returning('id');
          console.log({ user_location_result });
        }
      }
      return {};
    }
  }

  create(createBlogDto: CreateBlogDto) {
    return 'This action adds a new blog';
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
