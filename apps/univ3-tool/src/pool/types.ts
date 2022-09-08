export interface IMintParams {
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

export interface IDecreaseParams {
  tokenId: string;
  liquidity: string;
  amount0Min: string;
  amount1Min: string;
  deadline: string;
}
