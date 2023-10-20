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

let storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, callback) {
    let ext = file.mimetype.match(/^image\/([\w-]+)/)?.[1] || 'bin';
    let filename = randomUUID() + '.' + ext;
    callback(null, filename);
  },
});

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
  addNewMark(@Body() body, @Headers() headers: {}, @Param() params: {}) {
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
}
