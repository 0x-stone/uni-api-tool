import { Test, TestingModule } from '@nestjs/testing';
import { EnvService } from '../common/services/env/env.service';
import { PoolService } from './pool.service';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { LoggerService } from '../common/services/logger/logger.service';
import { ethers, network } from 'hardhat';
import { BigNumber, Contract, Signer } from 'ethers';

describe('PoolService', () => {
  let service: PoolService;

  initEnvVars();
  function initEnvVars() {
    const envPath = './env/test.conf';
    const ENV = dotenv.config({
      path: path.resolve(process.cwd(), envPath),
    });
  }

  const USDC_BALANCE = 10000000000;
  const WETH_BALANCE = ethers.utils.parseEther('1');
  const USDC_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  const USDC_HOLDER = '0x55FE002aefF02F77364de339a1292923A15844B8';
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const WETH_HOLDER = '0xcb74075f036301b82c13df959ca9479b1ba0e660';
  const ERC20_ABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'authorizer',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'nonce',
          type: 'bytes32',
        },
      ],
      name: 'AuthorizationCanceled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'authorizer',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'nonce',
          type: 'bytes32',
        },
      ],
      name: 'AuthorizationUsed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_account',
          type: 'address',
        },
      ],
      name: 'Blacklisted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newBlacklister',
          type: 'address',
        },
      ],
      name: 'BlacklisterChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'burner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Burn',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newMasterMinter',
          type: 'address',
        },
      ],
      name: 'MasterMinterChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'minter',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'Mint',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'minter',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'minterAllowedAmount',
          type: 'uint256',
        },
      ],
      name: 'MinterConfigured',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'oldMinter',
          type: 'address',
        },
      ],
      name: 'MinterRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newAddress',
          type: 'address',
        },
      ],
      name: 'PauserChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newRescuer',
          type: 'address',
        },
      ],
      name: 'RescuerChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        { indexed: true, internalType: 'address', name: 'to', type: 'address' },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: '_account',
          type: 'address',
        },
      ],
      name: 'UnBlacklisted',
      type: 'event',
    },
    { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
    {
      inputs: [],
      name: 'CANCEL_AUTHORIZATION_TYPEHASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'DOMAIN_SEPARATOR',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'PERMIT_TYPEHASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'authorizer', type: 'address' },
        { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
      ],
      name: 'authorizationState',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
      name: 'blacklist',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'blacklister',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
      name: 'burn',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'authorizer', type: 'address' },
        { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
        { internalType: 'uint8', name: 'v', type: 'uint8' },
        { internalType: 'bytes32', name: 'r', type: 'bytes32' },
        { internalType: 'bytes32', name: 's', type: 'bytes32' },
      ],
      name: 'cancelAuthorization',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'minter', type: 'address' },
        {
          internalType: 'uint256',
          name: 'minterAllowedAmount',
          type: 'uint256',
        },
      ],
      name: 'configureMinter',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'currency',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'decrement', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'increment', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'tokenName', type: 'string' },
        { internalType: 'string', name: 'tokenSymbol', type: 'string' },
        { internalType: 'string', name: 'tokenCurrency', type: 'string' },
        { internalType: 'uint8', name: 'tokenDecimals', type: 'uint8' },
        { internalType: 'address', name: 'newMasterMinter', type: 'address' },
        { internalType: 'address', name: 'newPauser', type: 'address' },
        { internalType: 'address', name: 'newBlacklister', type: 'address' },
        { internalType: 'address', name: 'newOwner', type: 'address' },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'newName', type: 'string' }],
      name: 'initializeV2',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'lostAndFound', type: 'address' },
      ],
      name: 'initializeV2_1',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
      name: 'isBlacklisted',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'isMinter',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'masterMinter',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_to', type: 'address' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
      name: 'minterAllowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      name: 'nonces',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'paused',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'pauser',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
        { internalType: 'uint256', name: 'deadline', type: 'uint256' },
        { internalType: 'uint8', name: 'v', type: 'uint8' },
        { internalType: 'bytes32', name: 'r', type: 'bytes32' },
        { internalType: 'bytes32', name: 's', type: 'bytes32' },
      ],
      name: 'permit',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
        { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
        { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
        { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
        { internalType: 'uint8', name: 'v', type: 'uint8' },
        { internalType: 'bytes32', name: 'r', type: 'bytes32' },
        { internalType: 'bytes32', name: 's', type: 'bytes32' },
      ],
      name: 'receiveWithAuthorization',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
      name: 'removeMinter',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IERC20',
          name: 'tokenContract',
          type: 'address',
        },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'rescueERC20',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rescuer',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'value', type: 'uint256' },
        { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
        { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
        { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
        { internalType: 'uint8', name: 'v', type: 'uint8' },
        { internalType: 'bytes32', name: 'r', type: 'bytes32' },
        { internalType: 'bytes32', name: 's', type: 'bytes32' },
      ],
      name: 'transferWithAuthorization',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
      name: 'unBlacklist',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'unpause',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_newBlacklister', type: 'address' },
      ],
      name: 'updateBlacklister',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_newMasterMinter', type: 'address' },
      ],
      name: 'updateMasterMinter',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_newPauser', type: 'address' },
      ],
      name: 'updatePauser',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'newRescuer', type: 'address' },
      ],
      name: 'updateRescuer',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  let ownerSigner: Signer;
  let usdcSigner: Signer;
  let usdcContract: Contract;
  let wethContract: Contract;
  let wethSigner: Signer;
  beforeEach(async () => {
    [ownerSigner] = await ethers.getSigners();
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [USDC_HOLDER],
    });
    usdcSigner = await ethers.getSigner(USDC_HOLDER);

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [WETH_HOLDER],
    });
    wethSigner = await ethers.getSigner(WETH_HOLDER);

    usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, usdcSigner);

    wethContract = new ethers.Contract(WETH_ADDRESS, ERC20_ABI, wethSigner);

    await ownerSigner.sendTransaction({
      to: WETH_HOLDER,
      value: WETH_BALANCE,
    });

    await wethContract.transfer(ownerSigner.getAddress(), WETH_BALANCE);

    await usdcContract.transfer(ownerSigner.getAddress(), USDC_BALANCE);

    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolService, EnvService, LoggerService],
    }).compile();

    service = module.get<PoolService>(PoolService);
  });

  jest.setTimeout(20000);
  it('token0 and token1 should be ready', async () => {
    const balanceOfToken0: BigNumber = await usdcContract.balanceOf(
      ownerSigner.getAddress(),
    );
    const balanceOfToken1: BigNumber = await wethContract.balanceOf(
      ownerSigner.getAddress(),
    );
    expect(balanceOfToken0.toString()).not.toBeNull();
    expect(balanceOfToken1.toString()).not.toBeNull();
  });

  it('mint encode should be correct', async () => {
    const params = {
      token0: '0x6070733C068a5a30054A751605eFdC3a22e02d64',
      token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      fee: 1000,
      tickLower: '-115136',
      tickUpper: '-92109',
      amount0Desired: '49882979211620961850079940376',
      amount1Desired: '0',
      amount0Min: '49701278734004365626583707103',
      amount1Min: '0',
      recipient: '0xCB4B715c154b47CA51be4864f979e217912a4FF7',
      deadline: '1653541190',
    };
    expect(service).toBeDefined();
    // const result = await firstValueFrom(
    //   service.sendMintTransaction(params, OWNER_KEY),
    // );
  });
});
