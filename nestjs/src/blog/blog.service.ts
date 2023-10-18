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
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      let [tour_post_id] = await this.knex('post')
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
      for (let location of body.trip_location) {
        let [system_location_record] = await this.knex
          .select('id', 'place_id')
          .from('system_location')
          .where({
            place_id: location.id,
          });
        let [user_location_record] = await this.knex
          .select('id', 'place_id')
          .from('user_location')
          .where({
            place_id: location.id,
          });
        if (!user_location_record) {
          if (!system_location_record) {
            let [system_location_id] = await this.knex('system_location')
              .insert({
                place_id: location.id,
                name: location.name,
                address: location.address,
                latitude: location.lat,
                longitude: location.lng,
              })
              .returning('id');
            await this.knex('user_location')
              .insert({
                user_id: user_id,
                post_id: tour_post_id.id,
                system_location_id: system_location_id.id,
                place_id: location.place_id,
                is_delete: false,
              })
              .returning('id');
          }
          await this.knex('user_location')
            .insert({
              user_id: user_id,
              post_id: tour_post_id.id,
              system_location_id: system_location_record.id,
              place_id: system_location_record.place_id,
              is_delete: false,
            })
            .returning('id');
        }
      }
      return {};
    } catch (err) {
      throw err;
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
