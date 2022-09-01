import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from '../common/services/env/env.service';
import { PoolService } from './pool.service';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { LoggerService } from '../common/services/logger/logger.service';

describe('PoolService', () => {
  let service: PoolService;

  beforeEach(async () => {
    function initEnvVars() {
      const envPath = './env/test.conf';
      const ENV = dotenv.config({
        path: path.resolve(process.cwd(), envPath),
      });
    }
    initEnvVars();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolService, EnvService,LoggerService],
    }).compile();

    service = module.get<PoolService>(PoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('mint encode should be correct', () => {
    // expect(
    //   service.encodeMint({
    //     token0: '0x6070733C068a5a30054A751605eFdC3a22e02d64',
    //     token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    //     fee: 1000,
    //     tickLower: '-115136',
    //     tickUpper: '-92109',
    //     amount0Desired: '49882979211620961850079940376',
    //     amount1Desired: '0',
    //     amount0Min: '49701278734004365626583707103',
    //     amount1Min: '0',
    //     recipient: '0xCB4B715c154b47CA51be4864f979e217912a4FF7',
    //     deadline: '1653541190',
    //   }),
    // ).toBeTruthy();
  });
});
