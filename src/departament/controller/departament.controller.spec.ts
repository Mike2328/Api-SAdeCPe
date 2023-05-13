import { Test, TestingModule } from '@nestjs/testing';
import { DepartamentController } from './departament.controller';

describe('DepartamentController', () => {
  let controller: DepartamentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartamentController],
    }).compile();

    controller = module.get<DepartamentController>(DepartamentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
