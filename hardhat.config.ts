import { HardhatUserConfig } from 'hardhat/types';
import { accounts } from './helpers/test-wallets';
import { eEthereumNetwork, eNetwork, ePolygonNetwork } from './helpers/types';
import { HARDHATEVM_CHAINID } from './helpers/hardhat-constants';
import { NETWORKS_RPC_URL } from './helper-hardhat-config';
import dotenv from 'dotenv';
import glob from 'glob';
import path from 'path';
dotenv.config({ path: '../.env' });

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import 'hardhat-log-remover';
import 'hardhat-spdx-license-identifier';

if (!process.env.SKIP_LOAD) {
  glob.sync('./tasks/**/*.ts').forEach(function (file) {
    require(path.resolve(file));
  });
}

const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || '';
const MAINNET_FORK = process.env.MAINNET_FORK === 'true';
const TRACK_GAS = process.env.TRACK_GAS === 'true';
const BLOCK_EXPLORER_KEY = process.env.BLOCK_EXPLORER_KEY || '';

const mainnetFork = MAINNET_FORK
  ? {
      blockNumber: 16688267,
      url: NETWORKS_RPC_URL['main'],
    }
  : undefined;

const getCommonNetworkConfig = (networkName: eNetwork) => ({
  url: NETWORKS_RPC_URL[networkName] ?? '',
  accounts: {
    mnemonic: MNEMONIC,
    path: MNEMONIC_PATH,
    initialIndex: 0,
    count: 20,
  },
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true,
            },
          },
        },
      },
    ],
  },
  networks: {
    mumbai: getCommonNetworkConfig(ePolygonNetwork.mumbai),
    polygon: getCommonNetworkConfig(ePolygonNetwork.polygon),
    goerli: getCommonNetworkConfig(eEthereumNetwork.goerli),
    hardhat: {
      hardfork: 'london',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      chainId: HARDHATEVM_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: mainnetFork,
    },
    local: {
      url: 'http://127.0.0.1:8545/',
      accounts: {
        mnemonic: MNEMONIC,
        path: MNEMONIC_PATH,
        initialIndex: 0,
        count: 20,
      },
    },
  },
  gasReporter: {
    enabled: TRACK_GAS,
  },
  etherscan: {
    apiKey: BLOCK_EXPLORER_KEY,
  },
};

export default config;
