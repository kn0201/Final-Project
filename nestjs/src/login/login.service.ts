import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import * as nodemailer from 'nodemailer';
import { env } from 'src/env';
import { JwtService } from 'src/jwt/jwt.service';
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
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}

  async checkUsername(input) {
    let foundUsername = await this.knex('users')
      .select('username')
      .where('username', input.username)
      .first();

    if (foundUsername === undefined) {
      return { result: false };
    } else {
      return { result: true };
    }
  }

  async checkEmail(input) {
    let foundEmail = await this.knex('users')
      .select('email')
      .where('email', input.email)
      .first();

    if (foundEmail === undefined) {
      return { result: false };
    } else {
      return { result: true };
    }
  }

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

    const token = this.jwtService.encode({
      role: role,
      user_id: id,
      username: input.username,
    });
    return { token: token };
  }

  async register(
    body: {
      username: any;
      email: any;
      password: any;
      gender: any;
      age: any;
      country_id: any;
    },
    image,
  ) {
    let username = body.username;

    let hashedPW = await hashPassword(body.password);

    let result = await this.knex('users')
      .insert({
        username: body.username,
        email: body.email,
        password: hashedPW,
        gender: body.gender,
        age: body.age,
        country_id: body.country_id,
        rating: 0,
        role: 'member',
        is_delete: false,
      })
      .returning('id');

    let id = result[0].id;
    if (image != undefined) {
      let imageName = image.filename;
      let uploadResult = await this.knex('image')
        .insert({
          user_id: id,
          path: imageName,
          is_delete: false,
        })
        .returning('id');

      let image_id = uploadResult[0].id;

      await this.knex('users')
        .update({
          avatar_id: image_id,
        })
        .where('users.id', id);
    } else {
      let uploadResult = await this.knex('image')
        .insert({
          user_id: id,
          path: 'yukimin.png',
          is_delete: false,
        })
        .returning('id');

      let image_id = uploadResult[0].id;

      await this.knex('users')
        .update({
          avatar_id: image_id,
        })
        .where('users.id', id);
    }

    let emailUsername = username[0].toUpperCase() + username.slice(1);

    const mailOptions = {
      from: env.EMAIL_ADDRESS,
      to: body.email,
      subject: 'Trip Mingle Register',
      text:
        `Hi ${emailUsername} !` +
        '\n' +
        `Welcome to Trip Mingle` +
        '\n' +
        `Enjoy your member benefits!`,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent:' + info.response);
      }
    });
    ``;
    const token = this.jwtService.encode({
      username: username,
      role: 'member',
      user_id: id,
    });
    return { token: token };
  }
}
