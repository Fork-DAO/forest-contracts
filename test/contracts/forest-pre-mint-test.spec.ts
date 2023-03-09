import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { ForestPreMint__factory } from '../../typechain-types';
import {
  deployer,
  maxSupply,
  runFreshSuite,
  treasuryAddress,
  unitPrice,
  forestPreMint,
  userTwo,
  userTwoAddress,
  treasury,
  treasuryInitialBalance,
  userThree,
  userThreeAddress,
} from '../__setup.spec';

const ERRORS = {
  CONSTRUCTOR_PARAMS_INVALID: 'ConstructorParamsInvalid()',
  MAX_SUPPLY_30_REACHED: 'MaxSupplyReached(30)',
  PAYMENT_AMOUNT_10_INVALID: `PaymentAmountInvalid(${unitPrice}, 0)`,
};

runFreshSuite('Forest Pre Mint test', function () {
  describe('Deployment validations', function () {
    it('should fail on maxSupply=Zero', async function () {
      expect(
        new ForestPreMint__factory(deployer).deploy(0, unitPrice, treasuryAddress)
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });

    it('should fail on unitPrice=Zero', async function () {
      expect(
        new ForestPreMint__factory(deployer).deploy(maxSupply, 0, treasuryAddress)
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });

    it('should fail on address=Zero', async function () {
      expect(
        new ForestPreMint__factory(deployer).deploy(
          maxSupply,
          unitPrice,
          ethers.constants.AddressZero
        )
      ).to.be.revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
    });
  });

  describe('Pre mint validations', function () {
    it('should fail if ask more mint than available', async function () {
      expect(forestPreMint.connect(userTwo).preMint(maxSupply + 1)).to.be.revertedWith(
        ERRORS.MAX_SUPPLY_30_REACHED
      );
    });

    it('should fail if sold out', async function () {
      const maxSupplyPrice = unitPrice.mul(maxSupply);
      await forestPreMint.connect(userTwo).preMint(maxSupply, { value: maxSupplyPrice });
      const soldOutMint = forestPreMint.connect(userThree).preMint(1, { value: unitPrice });
      await expect(soldOutMint).to.be.revertedWith(ERRORS.MAX_SUPPLY_30_REACHED);
    });

    it('should fail if sold out and overflow', async function () {
      const maxSupplyPrice = unitPrice.mul(maxSupply);
      await forestPreMint.connect(userTwo).preMint(maxSupply, { value: maxSupplyPrice });
      const soldOutMint = forestPreMint
        .connect(userThree)
        .preMint(ethers.constants.MaxUint256.sub(1), { value: unitPrice });
      await expect(soldOutMint).to.be.reverted;
    });

    it('should fail if msg.value is not enough', async function () {
      expect(forestPreMint.connect(userTwo).preMint(1)).to.be.revertedWith(
        ERRORS.PAYMENT_AMOUNT_10_INVALID
      );
    });
  });

  describe('Pre mint', function () {
    it('should buy one mint', async function () {
      const preMint = forestPreMint.connect(userTwo).preMint(1, { value: unitPrice });
      expect(await preMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, 1);
      expect(await treasury.getBalance()).to.be.eql(treasuryInitialBalance.add(unitPrice));
    });

    it('should buy ten mint', async function () {
      const tenMintPrice = unitPrice.mul(10);
      const preMint = forestPreMint.connect(userTwo).preMint(10, { value: tenMintPrice });
      expect(await preMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, 10);
      expect(await treasury.getBalance()).to.be.eql(treasuryInitialBalance.add(tenMintPrice));
    });

    it('different buyers should buy', async function () {
      const tenMintPrice = unitPrice.mul(10);
      const firstPreMint = forestPreMint.connect(userTwo).preMint(10, { value: tenMintPrice });
      expect(await firstPreMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, 10);
      const secondPreMint = forestPreMint.connect(userThree).preMint(10, { value: tenMintPrice });
      expect(await secondPreMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userThreeAddress, 10);
      expect(await treasury.getBalance()).to.be.eql(
        treasuryInitialBalance.add(tenMintPrice).add(tenMintPrice)
      );
    });

    it('different buyers should sold out', async function () {
      const eachMintAmount = maxSupply / 2;
      const eachMintPrice = unitPrice.mul(eachMintAmount);
      const firstPreMint = forestPreMint
        .connect(userTwo)
        .preMint(eachMintAmount, { value: eachMintPrice });
      expect(await firstPreMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, eachMintAmount);
      const secondPreMint = forestPreMint
        .connect(userThree)
        .preMint(eachMintAmount, { value: eachMintPrice });
      expect(await secondPreMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userThreeAddress, eachMintAmount);
      expect(await treasury.getBalance()).to.be.eql(
        treasuryInitialBalance.add(unitPrice.mul(maxSupply))
      );
    });

    it('should buy two separated mints', async function () {
      const preMint = forestPreMint.connect(userTwo).preMint(1, { value: unitPrice });
      expect(await preMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, 1);
      expect(await treasury.getBalance()).to.be.eql(treasuryInitialBalance.add(unitPrice));
      expect(await forestPreMint.getMintByAddress(userTwoAddress)).to.be.eq(ethers.constants.One);
      const secondPreMint = forestPreMint.connect(userTwo).preMint(1, { value: unitPrice });
      expect(await secondPreMint)
        .to.emit(forestPreMint, 'PreMint')
        .withArgs(userTwoAddress, 1);
      expect(await treasury.getBalance()).to.be.eql(
        treasuryInitialBalance.add(unitPrice).add(unitPrice)
      );
      expect(await forestPreMint.getMintByAddress(userTwoAddress)).to.be.eq(ethers.constants.Two);
    });
  });
});
