import { Test, TestingModule } from '@nestjs/testing';
import { CapTagsController } from './cap_tags.controller';

describe('CapTagsController', () => {
  let controller: CapTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapTagsController],
    }).compile();

    controller = module.get<CapTagsController>(CapTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
