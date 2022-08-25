import { Controller, Get } from '@nestjs/common';

@Controller('/system')
export class SystemController {
  @Get('/heartbeat')
  healthCheck(): string {
    return 'Success';
  }
}
