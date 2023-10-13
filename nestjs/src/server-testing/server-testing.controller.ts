import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServerTestingService } from './server-testing.service';
import { JwtService } from 'src/jwt/jwt.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('server-testing')
export class ServerTestingController {
  constructor(
    private readonly serverTestingService: ServerTestingService,
    private jwtService: JwtService,
  ) {}

  @Post()
  submitPayload(@Body() body: { id: number }) {
    if (body.id === -1) {
      const token = this.jwtService.encode({ id: -1 });
      return { token };
    }
    throw new HttpException('Not a Tester', HttpStatus.BAD_REQUEST);
  }

  @UseGuards(AuthGuard)
  @Get()
  testingJWT() {
    return { message: 'JWT passed' };
  }
}