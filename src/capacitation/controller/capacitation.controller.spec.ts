import { Test, TestingModule } from '@nestjs/testing';
import { CapacitationController } from './capacitation.controller';

describe('CapacitationController', () => {
  let controller: CapacitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapacitationController],
    }).compile();

    controller = module.get<CapacitationController>(CapacitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
