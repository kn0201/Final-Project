import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async getUserBookmarkStatus(id, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const existingBookmark = await this.knex
        .select('id')
        .from('bookmark')
        .where('user_id', user_id)
        .andWhere('post_id', id)
        .first();
      if (existingBookmark) {
        return { isBookmark: true };
      } else {
        return { isBookmark: false };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async bookmark(id, body, req) {
    try {
      const payload = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
      let user_id = payload.user_id;
      const existingBookmark = await this.knex
        .select('id')
        .from('bookmark')
        .where('user_id', user_id)
        .andWhere('post_id', id)
        .first();
      if (existingBookmark) {
        await this.knex('bookmark')
          .where({
            id: existingBookmark.id,
          })
          .del();
        let number_of_bookmark = await this.knex
          .count('id')
          .from('bookmark')
          .where('post_id', body.id)
          .first();
        return {
          number_of_bookmark: number_of_bookmark.count
            ? number_of_bookmark.count
            : 0,
        };
      } else {
        await this.knex('bookmark').insert({
          user_id: user_id,
          post_id: id,
        });
        let number_of_bookmark = await this.knex
          .count('id')
          .from('bookmark')
          .where('post_id', body.id)
          .first();
        return { number_of_bookmark: number_of_bookmark.count };
      }
    } catch (err) {
      console.log(err);
    }
  }
}
