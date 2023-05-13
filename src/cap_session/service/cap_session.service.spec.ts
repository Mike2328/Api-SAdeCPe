import { Test, TestingModule } from '@nestjs/testing';
import { CapSessionService } from './cap_session.service';

describe('CapSessionService', () => {
  let service: CapSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapSessionService],
    }).compile();

    service = module.get<CapSessionService>(CapSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
