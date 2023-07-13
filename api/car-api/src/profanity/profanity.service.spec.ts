import { Test, TestingModule } from '@nestjs/testing';
import { ProfanityService } from './profanity.service';

describe('ProfanityService', () => {
  let service: ProfanityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfanityService],
    }).compile();

    service = module.get<ProfanityService>(ProfanityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
