import { Test, TestingModule } from '@nestjs/testing';
import { CapSessionController } from './cap_session.controller';

describe('CapSessionController', () => {
  let controller: CapSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapSessionController],
    }).compile();

    controller = module.get<CapSessionController>(CapSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
