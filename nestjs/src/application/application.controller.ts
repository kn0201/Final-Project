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
  @Get('status/:post_id')
  getUserAcceptStatus(@Param('post_id') post_id: string, @Req() req: Request) {
    return this.applicationService.getUserAcceptStatus(+post_id, req);
  }

  @Get('all/:post_id')
  getAllConfirmStatus(@Param('post_id') post_id: string) {
    return this.applicationService.getAllConfirmStatus(+post_id);
  }

  @UseGuards(AuthGuard)
  @Get('users/:post_id')
  getAppliedUsers(@Param('post_id') post_id: string, @Req() req: Request) {
    return this.applicationService.getAppliedUsers(+post_id, req);
  }

  @UseGuards(AuthGuard)
  @Get('tour/:post_id/:post_user_id')
  getConfirmedUsersList(
    @Param('post_id') post_id: string,
    @Param('post_user_id') post_user_id: string,
    @Req() req: Request,
  ) {
    return this.applicationService.getConfirmedUsersList(
      +post_id,
      +post_user_id,
      req,
    );
  }

  @UseGuards(AuthGuard)
  @Get('plan/:post_id/:post_user_id')
  getCheckPlanStatus(
    @Param('post_id') post_id: string,
    @Param('post_user_id') post_user_id: string,
    @Req() req: Request,
  ) {
    return this.applicationService.getCheckPlanStatus(
      +post_id,
      +post_user_id,
      req,
    );
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
  @Patch('confirm/:post_id/:id')
  confirmApplication(
    @Param('post_id') post_id: string,
    @Param('id') id: string,
    @Body() body: Body,
    @Req() req: Request,
  ) {
    let input = acceptParser.parse(body);
    return this.applicationService.confirmApplication(
      +post_id,
      +id,
      input,
      req,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('reject/:post_id/:id')
  rejectApplication(
    @Param('post_id') post_id: string,
    @Param('id') id: string,
    @Body() body: Body,
    @Req() req: Request,
  ) {
    let input = acceptParser.parse(body);
    return this.applicationService.rejectApplication(+post_id, +id, input, req);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  applyTour(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    let input = applyTourParser.parse(body);
    return this.applicationService.applyTour(+id, req);
  }
}
