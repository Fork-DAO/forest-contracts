import {
    ePolygonNetwork,
    iParamsPerNetwork,
} from './helpers/types';

import dotenv from 'dotenv';
dotenv.config({});

export const NETWORKS_RPC_URL: iParamsPerNetwork<string> = {
    [ePolygonNetwork.mumbai]: process.env.MUMBAI_RPC_URL || ''
};
