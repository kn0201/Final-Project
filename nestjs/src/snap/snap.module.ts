import { Module } from '@nestjs/common';
import { SnapController } from './snap.controller';
import { SnapService } from './snap.service';

@Module({
  controllers: [SnapController],
  providers: [SnapService]
})
export class SnapModule {}
