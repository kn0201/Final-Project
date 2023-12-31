import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlanningService } from './planning.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getJWTPayload, maybeGetJWTPayload } from 'src/jwt';
import { id, number, object, string } from 'cast.ts';
import { storage } from 'src/uploads';
// @UseGuards(AuthGuard)
@Controller('planning')
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Get('my-plans')
  getMyPlans(@Headers() headers: {}) {
    let jwt = maybeGetJWTPayload(headers);
    if (!jwt) {
      return { planList: [] };
    }
    return this.planningService.getMyPlanList(jwt.user_id);
  }

  @Get('group-plans')
  getGroupPlans(@Headers() headers: {}) {
    let jwt = maybeGetJWTPayload(headers);
    // console.log(jwt);
    if (!jwt) {
      return { planList: [] };
    }
    return this.planningService.getGroupPlanList(jwt.user_id);
  }

  @Post('tour_plan')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  addNewTourPlan(
    @Body() body,
    @UploadedFile() image: Express.Multer.File | undefined,
    @Headers() headers: {},
  ) {
    let jwt = getJWTPayload(headers);

    let input = object({
      body: object({
        title: string(),
        post_id: number(),
        user_list: string(),
      }),
    }).parse({ body });

    return this.planningService.addNewTourPlan({
      user_id: jwt.user_id,
      title: input.body.title,
      user_list: input.body.user_list,
      image_file: image?.filename,
      post_id: input.body.post_id,
    });
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
    // console.log('image:', image);
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
  }

  @Get(':plan_id/mark')
  async getMarks(
    @Param('plan_id') plan_id: string,
    // @Param('mark') mark: string,
  ) {
    return this.planningService.getMarks(+plan_id);
  }

  @Get(':plan_id/event')
  async getEvent(@Param('plan_id') plan_id: string) {
    return this.planningService.getEvent(+plan_id);
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
        selectedDate: string(),
        startTime: string(),
        endTime: string(),
        location: string(),
      }),
      params: object({
        plan_id: id(),
      }),
    }).parse({ body, params });

    return this.planningService.addNewEvent(jwt.user_id, {
      planning_id: input.params.plan_id,
      selected_date: input.body.selectedDate,
      start_time: input.body.startTime,
      end_time: input.body.endTime,
      location: input.body.location,
    });
  }
}
