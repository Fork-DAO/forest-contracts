import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { verifyContract } from './helpers/utils';
import { ForestNFT__factory } from '../typechain-types';
import { MAX_SUPPLY, UNIT_PRICE } from './helpers/constants';

task('verify-nft', 'verifies the fork forest nft').setAction(async ({}, hre) => {
  const ethers = hre.ethers;
  const accounts = await ethers.getSigners();
  const treasuryAddress = accounts[0].address;
  const deployer = accounts[2];
  const nftAddress = '0x29a88f8f1A8503544409f5926f3A37A748FD1989';

  console.log(`\n-- Verifying ForestNFT.sol --`);
  const forestNFTContract = ForestNFT__factory.connect(nftAddress, deployer);
  const forestNFT = await verifyContract(
    forestNFTContract,
    [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
    'contracts/ForestNFT.sol:ForestNFT'
  );
  console.log(`\n-- Verify succesful at ${forestNFT.address} --`);
});
