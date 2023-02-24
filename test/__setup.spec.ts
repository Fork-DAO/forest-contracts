import { expect, use } from 'chai';
import '@nomiclabs/hardhat-ethers';
import { Signer, Wallet } from "ethers";
import { revertToSnapshot, takeSnapshot } from "./helpers/utils";
import { FAKE_PRIVATEKEY } from './helpers/constants';
import { solidity } from 'ethereum-waffle';
import { Foo, Foo__factory } from "../typechain-types";
import { ethers } from 'hardhat';

use(solidity);

export let accounts: Signer[];
export let deployer: Signer;
export let user: Signer;
export let userTwo: Signer;
export let userThree: Signer;
export let governance: Signer;
export let deployerAddress: string;
export let userAddress: string;
export let userTwoAddress: string;
export let userThreeAddress: string;
export let foo: Foo;


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
};

before(async function () {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    userTwo = accounts[2];
    userThree = accounts[4];
    governance = accounts[3];

    deployerAddress = await deployer.getAddress();
    userAddress = await user.getAddress();
    userTwoAddress = await userTwo.getAddress();
    userThreeAddress = await userThree.getAddress();
    // Deployment
    foo = await new Foo__factory(deployer).deploy(deployerAddress);
    expect(foo).to.not.be.undefined;
});