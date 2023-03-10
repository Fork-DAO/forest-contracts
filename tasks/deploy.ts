import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { delay, deployContract } from './helpers/utils';
import { ForestPreMint__factory, ForestNFT__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('deploy-premint', 'deploys the fork forest premint').setAction(async ({}, hre) => {
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

task('deploy-nft', 'deploys the fork forest premint').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];
  const preMintAddress = '0xH4rdcodeIt';

  console.log(`\n-- Deploying ForestNFT.sol --`);
  const forestNFT = await deployContract(new ForestNFT__factory(deployer).deploy(preMintAddress));
  console.log(`\n-- Deploy succesful at ${forestNFT.address} --`);
});

task('deploy-all', 'deploys the whole fork forest').setAction(async ({}, hre) => {
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
  const forestNFT = await deployContract(new ForestNFT__factory(deployer).deploy(preMint.address));
  console.log(`\n-- Deploy succesful at ${forestNFT.address} --`);
});
