import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { comparePassword } from 'utils/hash';

@Injectable()
export class LoginService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async login(input) {
    console.log(input);

    // let foundUser = await this.knex('users')
    //   .select('role', 'id', 'password')
    //   .where('username', input.username)
    //   .first();
    // if (!foundUser) throw new UnauthorizedException('Wrong Username/Password');

    // let match: boolean = await comparePassword({
    //   password: input.password,
    //   password_hash: foundUser.password,
    // });
    // if (!match) throw new UnauthorizedException('Wrong Username/Password');

    // let role = foundUser.role;
    // let id = foundUser.id;
    // req.session.role = role;

    return input;
  }
}
