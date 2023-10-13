import { Injectable } from '@nestjs/common';
import * as jwt from 'jwt-simple';
import { env } from '../env';
import { JWT_Payload } from 'utils/types';

@Injectable()
export class JwtService {
  private JWT_SECRET: string = env.JWT_SECRET;
  constructor() {}

  encode(payload: JWT_Payload): string {
    return jwt.encode(payload, this.JWT_SECRET);
  }

  decode(token: string) {
    return jwt.decode(token, this.JWT_SECRET);
  }
}
