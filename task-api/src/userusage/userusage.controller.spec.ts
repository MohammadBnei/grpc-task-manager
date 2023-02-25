import { Test, TestingModule } from '@nestjs/testing';
import { UserusageController } from './userusage.controller';

describe('UserusageController', () => {
  let controller: UserusageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserusageController],
    }).compile();

    controller = module.get<UserusageController>(UserusageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
