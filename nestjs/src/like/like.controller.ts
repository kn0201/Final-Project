import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { likeParser } from 'utils/parser';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Get(':id')
  getLikeNumber(@Param('id') id: string) {
    return this.likeService.getLikeNumber(+id);
  }

  @UseGuards(AuthGuard)
  @Get('status/:id')
  getUserLikeStatus(@Param('id') id: string, @Req() req: Request) {
    return this.likeService.getUserLikeStatus(+id, req);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  like(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    let input = likeParser.parse(body);
    return this.likeService.like(+id, input, req);
  }
}
