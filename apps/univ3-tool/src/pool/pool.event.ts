import { Server } from 'socket.io';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { map, Observable, ReplaySubject } from 'rxjs';
import { ethers } from 'ethers';
import { EnvService } from '../common/services/env/env.service';
import { abi as IUniswapV3Pool } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';

const UNI_USDT_ETH_POOL = '0x11b815efB8f581194ae79006d24E0d814B7697F6';

const sub = new ReplaySubject(1);

@WebSocketGateway(81, { transports: ['websocket'] })
export class PoolEvent {
  private provider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(this.envService.endPoint.NODE_LINK);

  private poolContract = this.createPoolContract();

  constructor(private envService: EnvService) {
    this.tickPrice();
    this.poolContract.on('Swap', async (event) => {
      this.tickPrice();
    });
  }

  @WebSocketServer()
  server: Server;

  private async tickPrice() {
    try {
      const data = await this.poolContract.slot0();
      const { sqrtPriceX96 } = data;
      sub.next(sqrtPriceX96.toString());
    } catch (e) {}
  }

  private createPoolContract() {
    return new ethers.Contract(
      UNI_USDT_ETH_POOL,
      IUniswapV3Pool,
      this.provider,
    );
  }

  @SubscribeMessage('subscribe_price')
  handleEvent(@MessageBody() data: string): Observable<WsResponse<number>> {
    return sub.pipe(
      map((item: number) => {
        console.log(item);
        return { event: 'price_update', data: item };
      }),
    );
  }
}
