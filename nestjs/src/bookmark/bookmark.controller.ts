import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { bookmarkParser } from 'utils/parser';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  getUserBookmarkStatus(@Param('id') id: string, @Req() req: Request) {
    return this.bookmarkService.getUserBookmarkStatus(+id, req);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  bookmark(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    let input = bookmarkParser.parse(body);
    return this.bookmarkService.bookmark(+id, input, req);
  }
}
