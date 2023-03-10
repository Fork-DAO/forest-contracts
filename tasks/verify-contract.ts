import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { delay, verifyContract } from './helpers/utils';
import { ForestNFT__factory, ForestPreMint__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('verify-premint', 'verifies the fork forest premint').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];
  const premintAddress = '0x466b832D391cD52E066A8fFc88c39a1fa4547112';

  console.log(`\n-- Verifying ForestPreMint.sol --`);
  const forestPreMint = ForestPreMint__factory.connect(premintAddress, deployer);
  const preMint = await verifyContract(
    forestPreMint,
    [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
    'contracts/ForestPreMint.sol:ForestPreMint'
  );
  console.log(`\n-- Verify succesful of ForestPreMint.sol at ${preMint.address} --`);
});

task('verify-nft', 'verifies the fork forest nft').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];
  const premintAddress = '0x466b832D391cD52E066A8fFc88c39a1fa4547112';
  const nftAddress = '0x29a88f8f1A8503544409f5926f3A37A748FD1989';

  console.log(`\n-- Verifying ForestNFT.sol --`);
  const forestNFTContract = ForestNFT__factory.connect(nftAddress, deployer);
  const forestNFT = await verifyContract(
    forestNFTContract,
    [premintAddress],
    'contracts/ForestNFT.sol:ForestNFT'
  );
  console.log(`\n-- Verify succesful at ${forestNFT.address} --`);
});

task('verify-all', 'verifies the whole fork forest').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];
  const premintAddress = '0x466b832D391cD52E066A8fFc88c39a1fa4547112';
  const nftAddress = '0x29a88f8f1A8503544409f5926f3A37A748FD1989';

  console.log(`\n-- Verifying ForestPreMint.sol --`);
  const forestPreMint = ForestPreMint__factory.connect(premintAddress, deployer);
  const preMint = await verifyContract(
    forestPreMint,
    [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
    'contracts/ForestPreMint.sol:ForestPreMint'
  );
  console.log(`\n-- Verify succesful of ForestPreMint.sol at ${preMint.address} --`);
  await delay(5000);
  console.log(`\n-- Verifying ForestNFT.sol --`);
  const forestNFTContract = ForestNFT__factory.connect(nftAddress, deployer);
  const forestNFT = await verifyContract(
    forestNFTContract,
    [preMint.address],
    'contracts/ForestNFT.sol:ForestNFT'
  );
  console.log(`\n-- Verify succesful at ${forestNFT.address} --`);
});
