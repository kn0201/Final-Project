import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, JwtService],
})
export class BlogModule {}
