import { Controller, Get } from '@nestjs/common';
import { PoolStatusService } from './pool-status.service';

@Controller()
export class PoolStatusController {
  constructor(private readonly poolStatusService: PoolStatusService) {}

  @Get()
  getHello(): string {
    return this.poolStatusService.getHello();
  }
}
