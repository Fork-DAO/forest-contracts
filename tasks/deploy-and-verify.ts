import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { delay, deployWithVerify } from './helpers/utils';
import { ForestPreMint__factory, ForestNFT__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('deploy-and-verify-premint', 'deploys and verifies the fork forest premint').setAction(
  async ({}, hre) => {
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
  }
);

task('deploy-and-verify-nft', 'deploys and verifies the fork forest nft').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasuryAddress = accounts[0].address;
    const deployer = accounts[2];
    const preMintAddress = '0x466b832D391cD52E066A8fFc88c39a1fa4547112';

    console.log(`\n-- Deploying & Verifying ForestNFT.sol --`);
    const forestNFT = await deployWithVerify(
      new ForestNFT__factory(deployer).deploy(preMintAddress),
      [preMintAddress],
      'contracts/ForestNFT.sol:ForestNFT'
    );
    console.log(`\n-- Deploy & Verify succesful at ${forestNFT.address} --`);
  }
);

task('deploy-and-verify-premint', 'deploys and verifies the fork forest premint').setAction(
  async ({}, hre) => {
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
  }
);

task('deploy-and-verify-all', 'deploys and verifies the whole fork forest').setAction(
  async ({}, hre) => {
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
    await delay(5000);
    console.log(`\n-- Deploying & Verifying ForestNFT.sol --`);
    const forestNFT = await deployWithVerify(
      new ForestNFT__factory(deployer).deploy(preMint.address),
      [preMint.address],
      'contracts/ForestNFT.sol:ForestNFT'
    );
    console.log(`\n-- Deploy & Verify succesful at ${forestNFT.address} --`);
  }
);
