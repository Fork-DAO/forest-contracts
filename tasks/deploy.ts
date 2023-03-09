import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { delay, deployContract } from './helpers/utils';
import { ForestPreMint__factory, ForestNFT__factory } from '../typechain-types';

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
  await delay(5000);
  console.log(`\n-- Deploying ForestNFT.sol --`);
  const forestNFT = await deployContract(
    new ForestNFT__factory(deployer).deploy('0xCd7Ed93D4b95c9F93Ca7e2b4B8960Bd577A0DF9C')
  );
  console.log(`\n-- Deploy succesful at ${forestNFT.address} --`);
});
