import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { ForestPreMint__factory } from '../typechain-types';

task('test-premint', 'Make a transaction preminting one tree')
  .addParam('premintaddress', 'The deployed ForestPreMint contract address')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasury = accounts[0];
    const user = accounts[2];

    console.log(`\n-- Testing ForestPreMint.sol preMint function --`);
    const forestPreMint = ForestPreMint__factory.connect(args.premintaddress, user);
    console.log(`previousTreasuryBalance=${await treasury.getBalance()}`);
    console.log(`previousUserBalance=${await user.getBalance()}`);
    await forestPreMint.preMint(1, { value: 1 });
    console.log(`previousTreasuryBalance=${await treasury.getBalance()}`);
    console.log(`previousUserBalance=${await user.getBalance()}`);
    console.log(`\n-- Test succesful :) --`);
  });
