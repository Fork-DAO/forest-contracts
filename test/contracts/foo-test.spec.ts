import '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
import { deployerAddress, foo, runFreshSuite, userAddress } from '../__setup.spec';

runFreshSuite('Foo test', function () {
    it('should be the original address', async function () {
        expect(await foo.isTheAddress(deployerAddress)).to.eq(true);
    })

    it('shouldnt be the original address', async function () {
        expect(await foo.isTheAddress(userAddress)).to.eq(false);
    })
})