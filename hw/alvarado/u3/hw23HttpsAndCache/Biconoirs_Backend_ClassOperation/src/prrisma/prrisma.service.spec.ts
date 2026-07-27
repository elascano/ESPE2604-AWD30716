import { Test, TestingModule } from '@nestjs/testing';
import { PrrismaService } from './prrisma.service';

describe('PrrismaService', () => {
  let service: PrrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrrismaService],
    }).compile();

    service = module.get<PrrismaService>(PrrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
