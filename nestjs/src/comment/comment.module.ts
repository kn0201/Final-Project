import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {}
