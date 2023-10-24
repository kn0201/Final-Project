import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { acceptParser, applyTourParser } from 'utils/parser';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get(':id')
  getApplicationList(@Param('id') id: string) {
    return this.applicationService.getApplicationList(+id);
  }

  @UseGuards(AuthGuard)
  @Get('status/:id')
  getApplicationStatus(@Param('id') id: string, @Req() req: Request) {
    return this.applicationService.getApplicationStatus(+id, req);
  }

  @UseGuards(AuthGuard)
  @Get('acceptStatus/:post_id')
  getUserAcceptStatus(@Param('post_id') post_id: string, @Req() req: Request) {
    return this.applicationService.getUserAcceptStatus(+post_id, req);
  }

  @UseGuards(AuthGuard)
  @Get('users/:post_id')
  getAppliedUsers(@Param('post_id') post_id: string, @Req() req: Request) {
    return this.applicationService.getAppliedUsers(+post_id, req);
  }

  @UseGuards(AuthGuard)
  @Patch(':post_id/:id')
  acceptAppliedUsers(
    @Param('post_id') post_id: string,
    @Param('id') id: string,
    @Body() body: Body,
    @Req() req: Request,
  ) {
    let input = acceptParser.parse(body);
    return this.applicationService.acceptAppliedUsers(
      +post_id,
      +id,
      input,
      req,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  applyTour(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    let input = applyTourParser.parse(body);
    return this.applicationService.applyTour(+id, req);
  }
}
