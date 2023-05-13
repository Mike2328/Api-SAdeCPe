import { Test, TestingModule } from '@nestjs/testing';
import { CapTagsService } from './cap_tags.service';

describe('CapTagsService', () => {
  let service: CapTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapTagsService],
    }).compile();

    service = module.get<CapTagsService>(CapTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
