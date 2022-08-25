import { Test, TestingModule } from '@nestjs/testing';
import { PoolStatusController } from './pool-status.controller';
import { PoolStatusService } from './pool-status.service';

describe('PoolStatusController', () => {
  let poolStatusController: PoolStatusController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PoolStatusController],
      providers: [PoolStatusService],
    }).compile();

    poolStatusController = app.get<PoolStatusController>(PoolStatusController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(poolStatusController.getHello()).toBe('Hello World!');
    });
  });
});
