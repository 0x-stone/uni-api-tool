import { Injectable } from '@nestjs/common';

enum Eenv {
  DEV = 'dev',
  TESTNET = 'testnet',
  PROD = 'prod',
}

@Injectable()
export class EnvService {
  get env(): Eenv {
    return process.env.ENV as Eenv;
  }
  get isDevelopment() {
    return this.env === Eenv.DEV;
  }
  get isProd() {
    return this.env === Eenv.PROD;
  }
  get isTestnet() {
    return this.env === Eenv.TESTNET;
  }
  get endPoint() {
    const envs = {
      NODE_LINK: process.env.NODE_LINK,
      UNI_V3_POOL_MANAGE: process.env.UNI_V3_POOL_MANAGE,
      UNI_V3_FACTORY: process.env.UNI_V3_FACTORY,
      CHAIN_ID: process.env.CHAIN_ID,
    };
    return envs;
  }
}
