import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SyncCoinInfoService } from '../search/sync-coin-info/sync-coin-info.service';

@Controller('/system')
export class SystemController {
  constructor(private syncCoinInfoService: SyncCoinInfoService) {}
  @Get('/heartbeat')
  healthCheck(): string {
    const status = this.checkCoinInfo();
    if (status) {
      return 'Success';
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'service not ready',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private checkCoinInfo() {
    let status = true;
    Object.keys(this.syncCoinInfoService.priceInfos).map((item) => {
      if (Object.keys(this.syncCoinInfoService.priceInfos[item]).length === 0) {
        status = false;
      }
    });
    return status;
  }
}
