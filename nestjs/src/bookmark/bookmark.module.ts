import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, JwtService],
})
export class BookmarkModule {}
