import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nestjs-knex';
import { env } from './env';
import { LoginModule } from './login/login.module';
import { JwtService } from './jwt/jwt.service';
import { ServerTestingModule } from './server-testing/server-testing.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
