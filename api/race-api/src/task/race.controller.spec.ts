import { Test, TestingModule } from '@nestjs/testing';
import { RaceController } from './race.controller';

describe('RaceController', () => {
  let controller: RaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaceController],
    }).compile();

    controller = module.get<RaceController>(RaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
