import { expect, use } from 'chai';
import '@nomiclabs/hardhat-ethers';
import { BigNumber, Signer, Wallet } from 'ethers';
import { revertToSnapshot, takeSnapshot } from './helpers/utils';
import { FAKE_PRIVATEKEY } from './helpers/constants';
import { solidity } from 'ethereum-waffle';
import { ForestNFT, ForestNFT__factory } from '../typechain-types';
import { ethers } from 'hardhat';

use(solidity);

export let accounts: Signer[];
export let testWallet: Wallet;
export let deployer: Signer;
export let user: Signer;
export let userTwo: Signer;
export let userThree: Signer;
export let treasury: Signer;
export let treasuryInitialBalance: BigNumber;
export let deployerAddress: string;
export let userAddress: string;
export let userTwoAddress: string;
export let userThreeAddress: string;
export let treasuryAddress: string;
export let forestNFT: ForestNFT;
export const maxSupply = 30;
export const unitPrice = ethers.utils.parseEther('10');

export function runFreshSuite(name: string, tests: () => void) {
  describe(name, () => {
    beforeEach(async function () {
      await takeSnapshot();
    });
    tests();
    afterEach(async function () {
      await revertToSnapshot();
    });
  });
}

before(async function () {
  accounts = await ethers.getSigners();
  testWallet = new ethers.Wallet(FAKE_PRIVATEKEY).connect(ethers.provider);
  deployer = accounts[0];
  user = accounts[1];
  userTwo = accounts[2];
  userThree = accounts[4];
  treasury = accounts[3];

  deployerAddress = await deployer.getAddress();
  userAddress = await user.getAddress();
  userTwoAddress = await userTwo.getAddress();
  userThreeAddress = await userThree.getAddress();
  treasuryAddress = await treasury.getAddress();
  treasuryInitialBalance = await treasury.getBalance();

  // Deployment
  forestNFT = await new ForestNFT__factory(deployer).deploy(maxSupply, unitPrice, treasuryAddress);
  expect(forestNFT).to.not.be.undefined;
});
