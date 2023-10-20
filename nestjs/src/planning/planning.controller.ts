import {
  Body,
  Controller,
  Get,
  NotImplementedException,
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
import {
  addMarkParser,
  addNewPlanParser,
  addPlanParser,
} from '../../utils/parser';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';

let storage = multer.diskStorage({
  destination: 'uploads',
  filename(req, file, callback) {
    let ext = file.mimetype.match(/^image\/([\w-]+)/)?.[1] || 'bin';
    let filename = randomUUID() + '.' + ext;
    callback(null, filename);
  },
});

@UseGuards(AuthGuard)
@Controller('planning')
export class PlanningController {
  constructor(private planningService: PlanningService) {}

  @Post('plan')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  addNewPlan(@Body() body, @UploadedFile() image, @Request() req: any) {
    console.log({ body, image });
    let input = addPlanParser.parse(body);
    console.log({ input });
    console.log(req.payload);

    return this.planningService.addNewPlan(req.payload.user_id, body, image);
    // return { success: true };

    throw new NotImplementedException('todo');
  }
  @Post('image')
  @UseInterceptors(FileInterceptor('image', { storage: storage }))
  async uploadImage(@UploadedFile() image) {
    console.log('image:', image);
    return;
  }

  @Post('addNewMark')
  addNewMark(@Body() body, @Request() req: any) {
    console.log({ body });
    let input = addMarkParser.parse(body);
    console.log({ input });
    console.log(req.payload);
    return this.planningService.addNewMark(req.payload.user_id, body);
  }
}
