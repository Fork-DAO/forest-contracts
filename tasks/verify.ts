import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { verifyContract } from './helpers/utils';
import { ForestNFT__factory, ForestPreMint__factory } from '../typechain-types';

const MAX_SUPPLY = 10;
const UNIT_PRICE = 1;

task('verify-contract', 'verifies the fork forest')
  // .addParam('premintaddress', 'The deployed ForestPreMint contract address')
  // .addParam('forestnftaddress', 'The deployed ForestNFT contract address')
  .setAction(async ({}, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasuryAddress = accounts[0].address;
    const deployer = accounts[2];

    // console.log(`\n-- Verifying ForestPreMint.sol --`);
    // const forestPreMint = ForestPreMint__factory.connect(args.premintaddress, deployer);
    // const preMint = await verifyContract(
    //   forestPreMint,
    //   [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
    //   'contracts/ForestPreMint.sol:ForestPreMint'
    // );
    // console.log(`\n-- Verify succesful of ForestPreMint.sol at ${preMint.address} --`);
    console.log(`\n-- Verifying ForestNFT.sol --`);
    const forestNFTContract = ForestNFT__factory.connect(
      '0xE7b919365199383dCD06a290d6942052415a4cC0',
      deployer
    );
    const forestNFT = await verifyContract(
      forestNFTContract,
      ['0xCd7Ed93D4b95c9F93Ca7e2b4B8960Bd577A0DF9C'],
      'contracts/ForestNFT.sol:ForestNFT'
    );
    console.log(`\n-- Verify succesful at ${forestNFT.address} --`);
  });
