import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolEvent } from './pool.event';
import { PoolController } from './pool.controller';

@Module({
  providers: [PoolService, PoolEvent],
  controllers: [PoolController],
})
export class PoolModule {}
