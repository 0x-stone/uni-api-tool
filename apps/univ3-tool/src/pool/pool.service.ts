import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import { Pool } from '@uniswap/v3-sdk';
import { Token } from '@uniswap/sdk-core';
import { abi as INonfungiblePositionManager } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json';
import { EnvService } from '../common/services/env/env.service';

interface ImintParams {
  token0: string;
  token1: string;
  fee: string;
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
  private _poolContract: Contract = this._createPoolConstract();

  constructor(private envService: EnvService) {
    console.log(this._encodeMint());
  }

  private _createPoolConstract() {
    const provider = new ethers.providers.JsonRpcProvider(
      this.envService.endPoint.NODE_LINK,
    );
    return new ethers.Contract(
      this.envService.endPoint.UNI_V3_POOL_MANAGE,
      INonfungiblePositionManager,
      provider,
    );
  }

  private _encodeMint() {
    return this._poolContract.interface.encodeFunctionData('mint', [
      {
        token0: '0x6070733C068a5a30054A751605eFdC3a22e02d64',
        token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        fee: '100',
        tickLower: '-115136',
        tickUpper: '-92109',
        amount0Desired: '49882979211620961850079940376',
        amount1Desired: '0',
        amount0Min: '49701278734004365626583707103',
        amount1Min: '0',
        recipient: '0xCB4B715c154b47CA51be4864f979e217912a4FF7',
        deadline: '1653541190',
      },
    ]);
  }
}
