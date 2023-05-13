import { Test, TestingModule } from '@nestjs/testing';
import { TypeStateController } from './type-state.controller';

describe('TypeStateController', () => {
  let controller: TypeStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeStateController],
    }).compile();

    controller = module.get<TypeStateController>(TypeStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
