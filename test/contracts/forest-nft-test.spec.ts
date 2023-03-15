import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ForestNFT__factory } from '../../typechain-types';
import {
  deployer,
  maxSupply,
  runFreshSuite,
  treasuryAddress,
  unitPrice,
  userTwo,
  userTwoAddress,
  treasury,
  treasuryInitialBalance,
  userThree,
  userThreeAddress,
  forestNFT,
  userAddress,
  user,
} from '../__setup.spec';

const ERRORS = {
  CONSTRUCTOR_PARAMS_INVALID: 'ConstructorParamsInvalid()',
  MAX_SUPPLY_30_REACHED: 'MaxSupplyReached(30)',
  PAYMENT_AMOUNT_10_INVALID: `PaymentAmountInvalid(${unitPrice}, 0)`,
  PAYMENT_FAILED: `PaymentFailed()`,
};

runFreshSuite('Forest NFT test', function () {
  describe('Deployment validations', function () {
    it('should fail on maxSupply=Zero', async function () {
      expect(
        new ForestNFT__factory(deployer).deploy(0, unitPrice, treasuryAddress)
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });

    it('should fail on unitPrice=Zero', async function () {
      expect(
        new ForestNFT__factory(deployer).deploy(maxSupply, 0, treasuryAddress)
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });

    it('should fail on address=Zero', async function () {
      expect(
        new ForestNFT__factory(deployer).deploy(maxSupply, unitPrice, ethers.constants.AddressZero)
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });
  });

  describe('Safe Mint validations', function () {
    it('should fail if ask more mint than available', async function () {
      expect(forestNFT.connect(userTwo).safeMint(maxSupply + 1)).to.be.revertedWith(
        ERRORS.MAX_SUPPLY_30_REACHED
      );
    });

    it('should fail if sold out', async function () {
      const maxSupplyPrice = unitPrice.mul(maxSupply);
      await forestNFT.connect(userTwo).safeMint(maxSupply, { value: maxSupplyPrice });
      const soldOutMint = forestNFT.connect(userThree).safeMint(1, { value: unitPrice });
      await expect(soldOutMint).to.be.revertedWith(ERRORS.MAX_SUPPLY_30_REACHED);
    });

    it('should fail if sold out and overflow', async function () {
      const maxSupplyPrice = unitPrice.mul(maxSupply);
      await forestNFT.connect(userTwo).safeMint(maxSupply, { value: maxSupplyPrice });
      const soldOutMint = forestNFT
        .connect(userThree)
        .safeMint(ethers.constants.MaxUint256.sub(1), { value: unitPrice });
      await expect(soldOutMint).to.be.reverted;
    });

    it('should fail if msg.value is not enough', async function () {
      expect(forestNFT.connect(userTwo).safeMint(1)).to.be.revertedWith(
        ERRORS.PAYMENT_AMOUNT_10_INVALID
      );
    });

    it('should revert with payment failed', async function () {
      const forestNFTWithInvalidTreasury = await new ForestNFT__factory(deployer).deploy(
        1,
        unitPrice,
        forestNFT.address
      );
      expect(
        forestNFTWithInvalidTreasury.connect(userTwo).safeMint(1, { value: unitPrice })
      ).to.be.revertedWith(ERRORS.PAYMENT_FAILED);
    });
  });

  describe('Safe Mint happy', function () {
    it('should mint all the collection in one tx', async function () {
      const treasuryBalanceBefore = await treasury.getBalance();
      const balanceBefore = await forestNFT.balanceOf(userAddress);
      await forestNFT.connect(user).safeMint(maxSupply, { value: unitPrice.mul(maxSupply) });
      const balanceAfter = await forestNFT.balanceOf(userAddress);
      expect(balanceAfter).to.be.eq(balanceBefore.add(maxSupply));
      expect(await treasury.getBalance()).to.be.eq(
        treasuryBalanceBefore.add(unitPrice.mul(maxSupply))
      );
      const soldOutMint = forestNFT.connect(user).safeMint(1, { value: unitPrice });
      await expect(soldOutMint).to.be.revertedWith(ERRORS.MAX_SUPPLY_30_REACHED);
    });

    it('should mint all the collection in separate tx', async function () {
      const treasuryBalanceBefore = await treasury.getBalance();
      const balanceBefore = await forestNFT.balanceOf(userAddress);
      for (let i = 0; i < maxSupply; i++) {
        await forestNFT.connect(user).safeMint(1, { value: unitPrice });
        const balanceAfter = await forestNFT.balanceOf(userAddress);
        expect(balanceAfter).to.be.eq(balanceBefore.add(i + 1));
      }
      expect(await treasury.getBalance()).to.be.eq(
        treasuryBalanceBefore.add(unitPrice.mul(maxSupply))
      );
      const soldOutMint = forestNFT.connect(user).safeMint(1, { value: unitPrice });
      await expect(soldOutMint).to.be.revertedWith(ERRORS.MAX_SUPPLY_30_REACHED);
    });

    it('should mint different users', async function () {
      const treasuryBalanceBefore = await treasury.getBalance();
      const userOneBalanceBefore = await forestNFT.balanceOf(userAddress);
      const userThreeBalanceBefore = await forestNFT.balanceOf(userThreeAddress);
      await forestNFT.connect(user).safeMint(1, { value: unitPrice });
      await forestNFT.connect(userThree).safeMint(2, { value: unitPrice.mul(2) });
      const userOneBalanceAfter = await forestNFT.balanceOf(userAddress);
      const userThreeBalanceAfter = await forestNFT.balanceOf(userThreeAddress);
      expect(userOneBalanceAfter).to.be.eq(userOneBalanceBefore.add(1));
      expect(userThreeBalanceAfter).to.be.eq(userThreeBalanceBefore.add(2));
      expect(await treasury.getBalance()).to.be.eq(treasuryBalanceBefore.add(unitPrice.mul(3)));
    });
  });
});
