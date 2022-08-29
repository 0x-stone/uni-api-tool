import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BigNumber, Contract, ethers } from 'ethers';
import { abi as INonfungiblePositionManager } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json';
import { abi as IPoolFactory } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';
import { abi as IPool } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { EnvService } from '../common/services/env/env.service';

interface ImintParams {
  token0: string;
  token1: string;
  fee: number;
  tickLower: string;
  tickUpper: string;
  amount0Desired: string;
  amount1Desired: string;
  amount0Min: string;
  amount1Min: string;
  recipient: string;
  deadline: string;
}


@Injectable()
export class PoolService {
  private _provider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(this.envService.endPoint.NODE_LINK);

  private _poolManage: Contract = this._createManageConstract();

  private _poolFactory: Contract = this._createFactoryConstract();

  constructor(private envService: EnvService) {}

  private MIN_TICK = -887272;

  private MAX_TICK = -this.MIN_TICK;

  private _createManageConstract() {
    return new ethers.Contract(
      this.envService.endPoint.UNI_V3_POOL_MANAGE,
      INonfungiblePositionManager,
      this._provider,
    );
  }

  private _createFactoryConstract() {
    return new ethers.Contract(
      this.envService.endPoint.UNI_V3_FACTORY,
      IPoolFactory,
      this._provider,
    );
  }

  encodeMint(params: ImintParams) {
    return this._poolManage.interface.encodeFunctionData('mint', [params]);
  }

  async getPoolContract(
    token1: string,
    token2: string,
    fee: number,
  ): Promise<Contract> {
    const contractAddress = await this._poolFactory.getPool(
      token1,
      token2,
      fee,
    );
    return new ethers.Contract(contractAddress, IPool, this._provider);
  }

  getTickSpacing(poolContract: Contract) {
    return poolContract.tickSpacing();
  }

  async checkRange(
    tickLower: number,
    tickUpper: number,
    token0: string,
    token1: string,
    fee: number,
  ) {
    if (tickLower < tickUpper) {
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

  async mint(params: ImintParams) {
    const { tickLower, tickUpper, token0, token1, fee } = params;
    await this.checkRange(
      BigNumber.from(tickLower).toNumber(),
      BigNumber.from(tickUpper).toNumber(),
      token0,
      token1,
      fee,
    );
  }
}
