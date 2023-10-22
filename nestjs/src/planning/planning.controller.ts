import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  NotImplementedException,
  Param,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PlanningService } from './planning.service';
import { AuthGuard } from 'src/auth/auth.guard';
import multer, { Multer, Field } from 'multer';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getJWTPayload } from 'src/jwt';
import { id, object, string } from 'cast.ts';
import { env } from 'src/env';
import { storage } from 'src/uploads';

// @UseGuards(AuthGuard)
@Controller('planning')
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Get('my-plans')
  getMyPlans(@Headers() headers: {}) {
    let jwt = getJWTPayload(headers);
    return this.planningService.getMyPlanList(jwt.user_id);
  }

  @Post('plan')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  addNewPlan(
    @Body() body,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Headers() headers: {},
  ) {
    let jwt = getJWTPayload(headers);

    let input = object({
      body: object({
        title: string(),
        // country: string(),
      }),
    }).parse({ body });

    return this.planningService.addNewPlan({
      user_id: jwt.user_id,
      title: input.body.title,
      image_file: image?.filename,
    });
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async uploadImage(@UploadedFile() image) {
    console.log('image:', image);
    return;
  }

  @Post(':plan_id/mark')
  async addNewMark(
    @Body() body: Body,
    @Headers() headers: {},
    @Param() params: {},
  ) {
    let jwt = getJWTPayload(headers);

    let input = object({
      body: object({
        start_date: string(),
        end_date: string(),
      }),
      params: object({
        plan_id: id(),
      }),
    }).parse({ body, params });

    return this.planningService.addNewMark(jwt.user_id, {
      planning_id: input.params.plan_id,
      start_date: input.body.start_date,
      end_date: input.body.end_date,
    });
    // throw new UnauthorizedException('Wrong Username/Password');
  }

  @Post(':plan_id/event')
  async addNewEvent(
    @Body() body: Body,
    @Headers() headers: {},
    @Param() params: {},
  ) {
    let jwt = getJWTPayload(headers);

    let input = object({
      body: object({
        selected_date: string(),
        start_time: string(),
        end_time: string(),
        location: string(),
      }),
      params: object({
        plan_id: id(),
      }),
    }).parse({ body, params });

    return this.planningService.addNewEvent(jwt.user_id, {
      planning_id: input.params.plan_id,
      selected_date: input.body.selected_date,
      start_time: input.body.start_time,
      end_time: input.body.end_time,
      location: input.body.location,
    });
  }
}
