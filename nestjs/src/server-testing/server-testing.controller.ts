import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ServerTestingService } from './server-testing.service';
import { JwtService } from 'src/jwt/jwt.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('server-testing')
export class ServerTestingController {
  constructor(
    private readonly serverTestingService: ServerTestingService,
    private jwtService: JwtService,
  ) {}

  @Post()
  submitPayload(@Body() body: { id: number }) {
    if (body.id === -1) {
      const token = this.jwtService.encode({
        user_id: -1,
        role: 'member',
        username: 'testing',
      });
      return { token };
    }
    throw new HttpException('Not a Tester', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(AuthGuard)
  @Get()
  testingJWT(@Request() req: any) {
    console.log(req.users);
    return { message: 'JWT passed' };
  }
}
