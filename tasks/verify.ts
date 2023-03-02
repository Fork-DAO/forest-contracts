import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { verifyContract } from './helpers/utils';
import { ForestPreMint__factory } from '../typechain-types';

const MAX_SUPPLY = 10;
const UNIT_PRICE = 1;

task('verify-contract', 'verifies the fork forest')
  .addParam('premintaddress', 'The deployed ForestPreMint contract address')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasuryAddress = accounts[0].address;
    const deployer = accounts[2];

    console.log(`\n-- Verifying ForestPreMint.sol --`);
    const forestPreMint = ForestPreMint__factory.connect(args.premintaddress, deployer);
    const preMint = await verifyContract(
      forestPreMint,
      [MAX_SUPPLY, UNIT_PRICE, treasuryAddress],
      'contracts/ForestPreMint.sol:ForestPreMint'
    );
    console.log(`\n-- Verify succesful of ForestPreMint.sol at ${preMint.address} --`);
  });
