import '@nomiclabs/hardhat-ethers';
import { task } from 'hardhat/config';
import { ForestNFT__factory, ForestPreMint__factory } from '../typechain-types';

task('test-mint', 'Make a transaction preminting one tree and safemint the nft').setAction(
  async ({}, hre) => {
    const ethers = hre.ethers;
    const accounts = await ethers.getSigners();
    const treasury = accounts[0];
    const user = accounts[2];
    const premintAddress = '0x466b832D391cD52E066A8fFc88c39a1fa4547112';
    const nftAddress = '0x29a88f8f1A8503544409f5926f3A37A748FD1989';

    console.log(`\n-- Testing ForestPreMint.sol preMint function --`);
    const forestPreMint = ForestPreMint__factory.connect(premintAddress, user);
    console.log(`previousTreasuryBalance=${await treasury.getBalance()}`);
    console.log(`previousUserBalance=${await user.getBalance()}`);
    let result = await forestPreMint.preMint(2, { value: 2 });
    console.log(`premint result is ${result}`);
    console.log(`previousTreasuryBalance=${await treasury.getBalance()}`);
    console.log(`previousUserBalance=${await user.getBalance()}`);
    console.log(`\n-- Test succesful :) --`);

    console.log(`\n-- Testing ForestNFT.sol safeMint function --`);
    const forestNFT = ForestNFT__factory.connect(nftAddress, user);
    result = await forestNFT.safeMint(user.address);
    console.log(`safe mint result ${JSON.stringify(result)}`);
    console.log(`baseUri: ${await forestNFT.baseURI()}`);
    console.log(`tokenUri: ${await forestNFT.tokenURI(1)}`);
    console.log(`tokenUri: ${await forestNFT.tokenURI(2)}`);
  }
);
