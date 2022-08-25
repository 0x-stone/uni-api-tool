import { Module } from '@nestjs/common';
import { PoolStatusController } from './pool-status.controller';
import { PoolStatusService } from './pool-status.service';

@Module({
  imports: [],
  controllers: [PoolStatusController],
  providers: [PoolStatusService],
})
export class PoolStatusModule {}
