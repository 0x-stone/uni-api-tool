import { Test, TestingModule } from '@nestjs/testing';
import { MetadataTransformService } from './metadata-transform.service';

describe('MetadataTransformService', () => {
  let service: MetadataTransformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataTransformService],
    }).compile();

    service = module.get<MetadataTransformService>(MetadataTransformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
