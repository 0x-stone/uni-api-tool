import { Injectable } from '@nestjs/common';

@Injectable()
export class PoolStatusService {
  getHello(): string {
    return 'Hello World!';
  }
}
