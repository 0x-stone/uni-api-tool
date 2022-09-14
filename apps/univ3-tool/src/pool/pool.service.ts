import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BigNumber, Contract, ethers } from 'ethers';
import { abi as INonfungiblePositionManager } from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json';
import { abi as IPoolFactory } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { abi as IPool } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { EnvService } from '../common/services/env/env.service';
import { catchError, EMPTY, from, map, mergeMap, of, tap } from 'rxjs';
import { LoggerService } from '../common/services/logger/logger.service';
import { IDecreaseParams, IMintParams } from './types';
@Injectable()
export class PoolService {
  private provider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(this.envService.endPoint.NODE_LINK);

  private poolManage: Contract = this.createManageConstract();

  private poolFactory: Contract = this.createFactoryConstract();

  constructor(
    private envService: EnvService,
    private loggerService: LoggerService,
  ) {}

  private MIN_TICK = -887272;

  private MAX_TICK = -this.MIN_TICK;

  private createManageConstract() {
    return new ethers.Contract(
      this.envService.endPoint.UNI_V3_POOL_MANAGE,
      INonfungiblePositionManager,
      this.provider,
    );
  }

  private createFactoryConstract() {
    return new ethers.Contract(
      this.envService.endPoint.UNI_V3_FACTORY,
      IPoolFactory,
      this.provider,
    );
  }

  private encodeMint(params: IMintParams) {
    return this.poolManage.interface.encodeFunctionData('mint', [params]);
  }

  private encodeRefund() {
    return this.poolManage.interface.encodeFunctionData('refundETH', []);
  }

  private encodeMulticall(bytes: string[]) {
    return this.poolManage.interface.encodeFunctionData('multicall', [bytes]);
  }

  private async getPoolContract(
    token1: string,
    token2: string,
    fee: number,
  ): Promise<Contract> {
    const contractAddress = await this.poolFactory.getPool(token1, token2, fee);
    return new ethers.Contract(contractAddress, IPool, this.provider);
  }

  getTickSpacing(poolContract: Contract) {
    return poolContract.tickSpacing();
  }

  private async checkRange(
    tickLower: number,
    tickUpper: number,
    token0: string,
    token1: string,
    fee: number,
  ) {
    if (tickLower > tickUpper) {
      throw new HttpException(
        'tickLower should < tickUpper',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (tickLower < this.MIN_TICK) {
      throw new HttpException('tickLower too low', HttpStatus.BAD_REQUEST);
    }
    if (tickUpper > this.MAX_TICK) {
      throw new HttpException('tickUpper too high', HttpStatus.BAD_REQUEST);
    }

    const tickSpacing = await this.getTickSpacing(
      await this.getPoolContract(token0, token1, fee),
    );
    if (tickLower % tickSpacing !== 0) {
      throw new HttpException(
        'tickLower % tickSpacing',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (tickUpper % tickSpacing !== 0) {
      throw new HttpException(
        'tickLower % tickSpacing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private encodeDecreaseLiquidity(params: IDecreaseParams) {
    return this.poolManage.interface.encodeFunctionData('decreaseLiquidity', [
      params,
    ]);
  }

  public sendMintTransaction(
    params: IMintParams,
    privateKey: string,
    gasLimit = 600000,
  ) {
    const { tickLower, tickUpper, token0, token1, fee } = params;
    let message: string;
    let httpStatus: HttpStatus;
    return from(
      this.checkRange(
        BigNumber.from(tickLower).toNumber(),
        BigNumber.from(tickUpper).toNumber(),
        token0,
        token1,
        fee,
      ),
    ).pipe(
      map((_) => {
        return this.encodeMint(params);
      }),
      map((mintCode) => {
        return this.encodeMulticall([mintCode]);
      }),
      catchError((e) => {
        this.loggerService.error(e);
        message = 'encode error';
        httpStatus = HttpStatus.BAD_REQUEST;
        return EMPTY;
      }),

      mergeMap((transactionData) => {
        const wallet = new ethers.Wallet(privateKey, this.provider);
        const txConfig = {
          type: 2,
          to: this.envService.endPoint.UNI_V3_POOL_MANAGE,
          data: transactionData,
          gasLimit,
          nonce: null,
          chainId: 31337,
          maxFeePerGas: 20569250185,
          maxPriorityFeePerGas: 1000000,
        };
       
        return of(txConfig).pipe(
          mergeMap(() => {
            return from(wallet.getTransactionCount());
          }),
          tap((count) => {
            txConfig.nonce = count;
          }),
          mergeMap(() => from(wallet.signTransaction(txConfig))),
        );
      }),

      mergeMap((signedTx) => {
        return from(this.provider.sendTransaction(signedTx));
      }),

      catchError((e) => {
        this.loggerService.error(e);
        message = 'sendTransaction error';
        httpStatus = HttpStatus.BAD_REQUEST;
        return EMPTY;
      }),

      tap((transaction) => {
        transaction
          .wait()
          .then((data) => {
            // do something
          })
          .catch();
      }),

      catchError(() => {
        throw new HttpException(message, httpStatus);
      }),
    );
  }

  public decreaseLiquidity(
    IDecreaseParams: IDecreaseParams,
    privateKey: string,
    gasLimit = 600000,
  ) {
    return of(this.encodeDecreaseLiquidity(IDecreaseParams)).pipe(
      map((code) => {
        return this.encodeMulticall([code]);
        // collect, sweeptoken
      }),
      mergeMap((transactionData) => {
        const wallet = new ethers.Wallet(privateKey, this.provider);
        const txConfig = {
          to: this.envService.endPoint.UNI_V3_POOL_MANAGE,
          data: transactionData,
          gas: gasLimit,
        };
        return from(wallet.signTransaction(txConfig));
      }),
      mergeMap((signedTx) => {
        return from(this.provider.sendTransaction(signedTx));
      }),
      catchError((e) => {
        throw new HttpException(
          'fail to decrese liquidity',
          HttpStatus.BAD_REQUEST,
        );
      }),
    );
  }
}
