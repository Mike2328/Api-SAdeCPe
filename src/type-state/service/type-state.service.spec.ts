import { Test, TestingModule } from '@nestjs/testing';
import { TypeStateService } from './type-state.service';

describe('TypeStateService', () => {
  let service: TypeStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeStateService],
    }).compile();

    service = module.get<TypeStateService>(TypeStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
