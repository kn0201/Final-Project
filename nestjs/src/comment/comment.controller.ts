import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { addCommentParser } from 'utils/parser';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(':id')
  getCommentInfo(@Param('id') id: string) {
    return this.commentService.getCommentInfo(+id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/add')
  postCommentInfo(
    @Param('id') id: string,
    @Body() body: Body,
    @Req() req: Request,
  ) {
    let input = addCommentParser.parse(body);
    return this.commentService.addComment(+id, input, req);
  }
}
