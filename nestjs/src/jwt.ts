import { UnauthorizedException } from '@nestjs/common';
import { ParseResult, id, object } from 'cast.ts';
import { decode } from 'jwt-simple';
import { env } from './env';

export let jwtParser = object({
  user_id: id(),
});

export type JWTPayload = ParseResult<typeof jwtParser>;

export function getJWTPayload(headers: { authorization?: string }) {
  let token = headers.authorization?.replace('Bearer ', '');
  if (!token) throw new UnauthorizedException('missing bearer token');
  try {
    let payload = decode(token, env.JWT_SECRET);
    return jwtParser.parse(payload);
  } catch (error) {
    throw new UnauthorizedException('invalid jwt token: ' + error);
  }
}
