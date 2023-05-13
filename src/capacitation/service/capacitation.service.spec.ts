import { Test, TestingModule } from '@nestjs/testing';
import { CapacitationService } from './capacitation.service';

describe('CapacitationService', () => {
  let service: CapacitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacitationService],
    }).compile();

    service = module.get<CapacitationService>(CapacitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
