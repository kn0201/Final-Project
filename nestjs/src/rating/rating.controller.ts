import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ratingParser } from 'utils/parser';

@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  rating(
    @Param('id') post_id: string,
    @Body() body: Body,
    @Req() req: Request,
  ) {
    let input = ratingParser.parse(body);
    return this.ratingService.rating(+post_id, input, req);
  }
}
