import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(':id')
  getCommentInfo(@Param('id') id: string) {
    return this.commentService.getCommentInfo(+id);
  }
}
