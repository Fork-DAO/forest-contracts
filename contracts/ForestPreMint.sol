// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import {ForestPreMintErrors} from './libraries/ForestPreMintErrors.sol';

contract ForestPreMint {
    using Counters for Counters.Counter;
    using Address for address payable;

    // Storage
    uint256 maxSupply;
    uint256 unitPrice;
    address payable treasury;
    Counters.Counter private mintCounter;
    mapping(address => uint256) mintsByAddress;

    // Events
    event PreMint(address indexed buyer);

    constructor(
        uint256 _maxSupply,
        uint256 _unitPrice,
        address payable _treasury
    ) {
        if (_maxSupply == 0 || _unitPrice == 0 || _treasury == address(0)) {
            revert ForestPreMintErrors.ConstructorParamsInvalid();
        }
        maxSupply = _maxSupply;
        unitPrice = _unitPrice;
        treasury = _treasury;
    }
}
