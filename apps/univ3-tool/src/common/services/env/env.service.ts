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
      WSS_DOMAIN: process.env.WSS_DOMAIN,
      API2_DOMAIN: process.env.API2_DOMAIN,
      ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
      ALGOLIA_COIN_API_KEY: process.env.ALGOLIA_COIN_API_KEY,
      ALGOLIA_COIN_INDEX_NAME: process.env.ALGOLIA_COIN_INDEX_NAME,
      ALARM_APP_ID: process.env.ALARM_APP_ID,
      ALARM_SECRET: process.env.ALARM_SECRET,
      ALARM_LINK: process.env.ALARM_LINK,
    };
    return envs;
  }
}
