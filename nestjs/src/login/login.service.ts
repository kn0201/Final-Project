import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import * as nodemailer from 'nodemailer';
import { env } from 'src/env';
import { comparePassword, hashPassword } from 'utils/hash';

@Injectable()
export class LoginService {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ADDRESS,
      pass: env.EMAIL_PASSWORD,
    },
  });
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async login(input) {
    let foundUser = await this.knex('users')
      .select('role', 'id', 'password')
      .where('username', input.username)
      .first();
    if (!foundUser) throw new UnauthorizedException('Wrong Username/Password');

    let match: boolean = await comparePassword({
      password: input.password,
      password_hash: foundUser.password,
    });
    if (!match) throw new UnauthorizedException('Wrong Username/Password');

    let role = foundUser.role;
    let id = foundUser.id;

    return { username: input.username, role: role, error: null, id: id };
  }

  async register(body: {
    username: any;
    email: any;
    password: any;
    gender: any;
    age: any;
    country: any;
  }) {
    let username = body.username;
    let hashedPW = await hashPassword(body.password);
    let result = await this.knex('users')
      .insert({
        username: body.username,
        email: body.email,
        password: hashedPW,
        gender: body.gender,
        age: body.age,
        country: body.country,
        rating: 0,
        role: 'member',
        is_delete: false,
      })
      .returning('id');
    let id = result[0].id;

    const mailOptions = {
      from: env.EMAIL_ADDRESS,
      to: body.email,
      subject: 'Trip Mingle Register',
      text:
        `Hi ${username}` +
        '\n' +
        `Welcome to Trip Mingle, Enjoy your member benefits!`,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent:' + info.response);
      }
    });
    return { username: username, id: id, role: 'member' };
  }
}
