import { Test, TestingModule } from '@nestjs/testing';
import { ServerTestingService } from './server-testing.service';

describe('ServerTestingService', () => {
  let service: ServerTestingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerTestingService],
    }).compile();

    service = module.get<ServerTestingService>(ServerTestingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
