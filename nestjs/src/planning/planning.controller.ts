import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PlanningService } from './planning.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('planning')
export class PlanningController {
  constructor(private planningService: PlanningService) {}
  //   @UseGuards(AuthGuard)
  //   @Get('planning')
  // //   async getPlanning(@Req() req: Request) {
  // //     return this.planningService.getPlanning(req);
  //   }
  //   @Get('addPlanning')
  //   async addPlanning(@Req() req: Request){
  //     return this.planningService.addPlanning(req);
  //   }
}
