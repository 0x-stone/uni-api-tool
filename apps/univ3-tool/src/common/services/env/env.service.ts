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
      
    };
    return envs;
  }
}
