export interface SymbolMap<T> {
  [symbol: string]: T;
}

export type eNetwork = ePolygonNetwork | eEthereumNetwork;

export enum ePolygonNetwork {
  mumbai = 'mumbai',
}

export enum eEthereumNetwork {
  goerli = 'goerli',
}

export enum EthereumNetworkNames {
  matic = 'matic',
  mumbai = 'mumbai',
}

export type tEthereumAddress = string;
export type tStringTokenBigUnits = string; // 1 ETH, or 10e6 USDC or 10e18 DAI

export type iParamsPerNetwork<T> = iPolygonParamsPerNetwork<T> | iEthereumParamsPerNetwork<T>;

export type iParamsPerNetworkAll<T> = iPolygonParamsPerNetwork<T>;

export interface iPolygonParamsPerNetwork<T> {
  [ePolygonNetwork.mumbai]: T;
}

export interface iEthereumParamsPerNetwork<T> {
  [eEthereumNetwork.goerli]: T;
}

export interface ObjectString {
  [key: string]: string;
}
