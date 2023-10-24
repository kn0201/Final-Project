import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { addTourPostParser } from 'utils/parser';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(AuthGuard)
  @Post('tour')
  addTourPost(@Body() body: Body, @Req() req: Request) {
    let input = addTourPostParser.parse(body);
    return this.blogService.addTourPost(input, req);
  }

  @Get()
  getTourPostInfo() {
    return this.blogService.getTourPostInfo();
  }

  @Get(':id')
  getTourPostDetail(@Param('id') id: string) {
    return this.blogService.getTourPostDetail(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  deletePost(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    return this.blogService.deletePost(+id, req);
  }
}
