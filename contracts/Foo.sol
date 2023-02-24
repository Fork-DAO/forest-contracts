// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Foo {
    address public someAddress;

    constructor(address _someAddress) {
        someAddress = _someAddress;
    }

    function isTheAddress(address _theAddress) public view returns (bool) {
        return someAddress == _theAddress;
    }
}
