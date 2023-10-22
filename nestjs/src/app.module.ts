import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { env } from './env';
import { LoginModule } from './login/login.module';
import { JwtService } from './jwt/jwt.service';
import { ServerTestingModule } from './server-testing/server-testing.module';
import { UserModule } from './user/user.module';

import { BlogModule } from './blog/blog.module';
import { LanguageModule } from './language/language.module';
import { CountryModule } from './country/country.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { resolve } from 'path';
import { PlanningModule } from './planning/planning.module';
import { CommentModule } from './comment/comment.module';
import { LocationModule } from './location/location.module';
import { LikeModule } from './like/like.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { RatingModule } from './rating/rating.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve('uploads'),
    }),
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          database: env.DB_NAME,
          user: env.DB_USERNAME,
          password: env.DB_PASSWORD,
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'knex_migrations',
        },
      },
    }),
    LoginModule,
    ServerTestingModule,
    UserModule,
    BlogModule,
    LanguageModule,
    CountryModule,
    PlanningModule,
    CommentModule,
    LikeModule,
    BookmarkModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
