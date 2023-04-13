import { eEthereumNetwork, ePolygonNetwork, iParamsPerNetwork } from './helpers/types';

import dotenv from 'dotenv';
dotenv.config({});

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
  [ePolygonNetwork.mumbai]: process.env.MUMBAI_RPC_URL || '',
  [eEthereumNetwork.goerli]: process.env.GOERLI_RPC_URL || '',
  [ePolygonNetwork.polygon]: process.env.POLYGON_RPC_URL || '',
};
