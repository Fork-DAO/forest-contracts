import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { deployContract, deployWithVerify } from './helpers/utils';
import { ForestPreMint__factory } from '../typechain-types';

const MAX_SUPPLY = 10;
const UNIT_PRICE = 1;

task('deploy', 'deploys the fork forest').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  const treasuryAddress = accounts[1].address;

  console.log(`\n-- Deploying ForestPreMint.sol --`);
  // const preMint = await deployWithVerify(
  //   new ForestPreMint__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress),
  //   [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
  //   'contracts/ForestPreMint.sol:ForestPreMint'
  // );
  const preMint = await deployContract(
    new ForestPreMint__factory(deployer).deploy(MAX_SUPPLY, UNIT_PRICE, treasuryAddress)
  );
  console.log(`\n-- Deploy succesful of ForestPreMint.sol at ${preMint.address} --`);
});
