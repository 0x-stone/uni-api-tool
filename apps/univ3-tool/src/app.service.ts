import { Injectable } from '@nestjs/common';


interface ImintBurnParams {
  poolAddress: string;
  tickLower: number;
  tickUpper: number;
  liquidity: number;
}

interface ImintPositionParams {}



@Injectable()
export class AppService {
  
  private _mint(params: ImintBurnParams): string {
    return 'Hello World!';
  }

  public mintPosition(params: ImintBurnParams) {
    const { tickLower, tickUpper, liquidity } = params;
    const pool = {}; // new
    // pool.mint(walletaddress, tickLower, tickUpper, liquidity, '');
  }

  public _burn(params: ImintBurnParams) {
    // (burned0, burned1) = pool.burn(tickLower, tickUpper, liquidity);
  }

  public _collect(params: ImintBurnParams) {
    //   (uint256 collect0, uint256 collect1) = pool.collect(
    //     address(this),
    //     tickLower,
    //     tickUpper,
    //     type(uint128).max,
    //     type(uint128).max
    // );
  }

  public _position(tickLower: number, tickUpper: number, address: string) {
    // pool
  }

  public burn(params: ImintBurnParams) {
    // (uint128 totalLiquidity, , , , ) = position(lastTickLower, lastTickUpper);
    //     require(
    //         totalLiquidity <= type(uint128).max && totalLiquidity > 0,
    //         "liquidity amount is wrong"
    //     );
    //     (uint256 burned0, uint256 burned1, uint256 fees0, uint256 fees1) = _burnAndCollect(
    //         lastTickLower,
    //         lastTickUpper,
    //         uint128(totalLiquidity)
    //     );
  }
}
