import { Module } from '@nestjs/common';
import { PoolService } from './pool.service';
import { PoolEvent } from './pool.event';

@Module({
  providers: [PoolService, PoolEvent],
  controllers: [],
})
export class PoolModule {}
