import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { deployContract } from './helpers/utils';
import { ForestNFT__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('deploy-nft', 'deploys the fork forest premint').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];

  console.log(`\n-- Deploying ForestNFT.sol --`);
  const forestNFT = await deployContract(
    new ForestNFT__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress)
  );
  console.log(`\n-- Deploy succesful at ${forestNFT.address} --`);
});
