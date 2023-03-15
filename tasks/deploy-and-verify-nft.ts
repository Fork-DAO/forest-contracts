import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { deployWithVerify } from './helpers/utils';
import { ForestNFT__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('deploy-and-verify-nft', 'deploys and verifies the fork forest nft').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasuryAddress = accounts[0].address;
    const deployer = accounts[2];

    console.log(`\n-- Deploying & Verifying ForestNFT.sol --`);
    const forestNFT = await deployWithVerify(
      new ForestNFT__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress),
      [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
      'contracts/ForestNFT.sol:ForestNFT'
    );
    console.log(`\n-- Deploy & Verify succesful at ${forestNFT.address} --`);
  }
);
