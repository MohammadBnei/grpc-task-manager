import { Test, TestingModule } from '@nestjs/testing';
import { RaceService } from './race.service';

describe('RaceService', () => {
  let service: RaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RaceService],
    }).compile();

    service = module.get<RaceService>(RaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
