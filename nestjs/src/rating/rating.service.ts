import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class RatingService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private jwtService: JwtService,
  ) {}
}