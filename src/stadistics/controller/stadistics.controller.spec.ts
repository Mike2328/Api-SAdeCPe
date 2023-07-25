import { Test, TestingModule } from '@nestjs/testing';
import { StadisticsController } from './stadistics.controller';

describe('StadisticsController', () => {
  let controller: StadisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StadisticsController],
    }).compile();

    controller = module.get<StadisticsController>(StadisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
