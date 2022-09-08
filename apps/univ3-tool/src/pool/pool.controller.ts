import { Body, Controller, Post } from '@nestjs/common';
import { PoolService } from './pool.service';
import { IDecreaseParams, IMintParams } from './types';

interface IMintBody {
  mintParams: IMintParams;
  privateKey: string;
  gasLimit?: number;
}

interface IDecreaseLiquidity {
  decreaseParams: IDecreaseParams;
  privateKey: string;
  gasLimit?: number;
}

@Controller('pool')
export class PoolController {
  constructor(private poolService: PoolService) {}

  @Post('mint')
  public mint(@Body() params: IMintBody) {
    return this.poolService.sendMintTransaction(
      params.mintParams,
      params.privateKey,
      params.gasLimit
    );
  }

  @Post('decreaseLiquidity')
  public decreaseLiquidity(@Body() params: IDecreaseLiquidity) {
    return this.poolService.decreaseLiquidity(
      params.decreaseParams,
      params.privateKey,
      params.gasLimit
    );
  }
}
