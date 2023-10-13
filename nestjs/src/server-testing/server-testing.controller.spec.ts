import { Test, TestingModule } from '@nestjs/testing';
import { ServerTestingController } from './server-testing.controller';
import { ServerTestingService } from './server-testing.service';

describe('ServerTestingController', () => {
  let controller: ServerTestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerTestingController],
      providers: [ServerTestingService],
    }).compile();

    controller = module.get<ServerTestingController>(ServerTestingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
