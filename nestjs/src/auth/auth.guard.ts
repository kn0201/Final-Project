import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) return false;

    const token = req.headers?.authorization.split(' ')[1];

    if (!token) return false;
    const payload = this.jwtService.decode(token);

    if (payload.user_id && typeof payload.user_id === 'number') {
      req.payload = payload;
      return true;
    } else {
      return false;
    }
  }
}
