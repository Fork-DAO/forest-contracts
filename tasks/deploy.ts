import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { deployContract } from './helpers/utils';
import { ForestPreMint__factory } from '../typechain-types';

const MAX_SUPPLY = 10;
const UNIT_PRICE = 1;

task('deploy', 'deploys and verifies the fork forest').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];

  console.log(`\n-- Deploying ForestPreMint.sol --`);
  const preMint = await deployContract(
    new ForestPreMint__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress)
  );
  console.log(`\n-- Deploy succesful at ${preMint.address} --`);
});
