import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { likeParser } from 'utils/parser';
import { getJWTPayload } from 'src/jwt';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get(':id')
  getLikeNumber(@Param('id') id: string) {
    return this.likeService.getLikeNumber(+id);
  }

  @UseGuards(AuthGuard)
  @Get('status/:id')
  getUserLikeStatus(@Param('id') id: string, @Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.likeService.getUserLikeStatus(+id, +jwt.user_id);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  like(@Param('id') id: string, @Body() body: Body, @Headers() headers: {}) {
    let input = likeParser.parse(body);
    let jwt = getJWTPayload(headers);
    return this.likeService.like(+id, input, +jwt.user_id);
  }
}
