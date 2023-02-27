import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ForestPreMint__factory } from '../../typechain-types';
import { ERRORS } from '../helpers/errors';
import { deployer, maxSupply, runFreshSuite, treasuryAddress, unitPrice } from '../__setup.spec';

runFreshSuite('Forest Pre Mint test', function () {

    describe('Deployment validations', function () {

        it('should fail on maxSupply=Zero', async function () {
            expect(new ForestPreMint__factory(deployer)
                .deploy(0, unitPrice, treasuryAddress))
                .to
                .be
                .revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
        });

        it('should fail on unitPrice=Zero', async function () {
            expect(new ForestPreMint__factory(deployer)
                .deploy(maxSupply, 0, treasuryAddress))
                .to
                .be
                .revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
        });

        it('should fail on address=Zero', async function () {
            expect(new ForestPreMint__factory(deployer)
                .deploy(maxSupply, unitPrice, ethers.constants.AddressZero))
                .to
                .be
                .revertedWith(ERRORS.CONSTRUCTOR_PARAMS_INVALID);
        });
    })
})