import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { deployWithVerify } from './helpers/utils';
import { ForestPreMint__factory } from '../typechain-types';

const MAX_SUPPLY = 10;
const UNIT_PRICE = 1;

task('deploy-and-verify', 'deploys and verifies the fork forest').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];

  console.log(`\n-- Deploying & Verifying ForestPreMint.sol --`);
  const preMint = await deployWithVerify(
    new ForestPreMint__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress),
    [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
    'contracts/ForestPreMint.sol:ForestPreMint'
  );
  console.log(`\n-- Deploy & Verify succesful at ${preMint.address} --`);
});
