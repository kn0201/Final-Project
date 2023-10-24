import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { applyTourParser } from 'utils/parser';

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
  @Get('users/:id')
  getAppliedUsers(@Param('id') id: string, @Req() req: Request) {
    return this.applicationService.getAppliedUsers(+id, req);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  applyTour(@Param('id') id: string, @Body() body: Body, @Req() req: Request) {
    let input = applyTourParser.parse(body);
    return this.applicationService.applyTour(+id, req);
  }
}
