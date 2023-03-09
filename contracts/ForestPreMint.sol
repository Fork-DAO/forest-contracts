// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/utils/Address.sol';
import {ForestPreMintErrors} from './libraries/ForestPreMintErrors.sol';

contract ForestPreMint {
    using Address for address payable;

    // Storage
    uint256 public maxSupply;
    uint256 public unitPrice;
    address payable public treasury;
    uint256 private mintCounter;
    mapping(address => uint256) mintsByContributor;

    // Events
    event PreMint(address indexed _buyer, uint256 _mintQuantity);

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

    function preMint(uint256 _mintQuantity) external payable {
        if (mintCounter + _mintQuantity > maxSupply) {
            revert ForestPreMintErrors.MaxSupplyReached(maxSupply);
        }
        uint256 amountToPay = _mintQuantity * unitPrice;
        if (amountToPay != msg.value) {
            revert ForestPreMintErrors.PaymentAmountInvalid(amountToPay, msg.value);
        }
        mintsByContributor[msg.sender] += _mintQuantity;
        mintCounter += _mintQuantity;
        emit PreMint(msg.sender, _mintQuantity);
        (bool sent, ) = treasury.call{value: msg.value}('');
        if (!sent) {
            revert ForestPreMintErrors.PaymentFailed();
        }
    }

    function getMintByAddress(address _contributor) external view returns (uint256) {
        return mintsByContributor[_contributor];
    }
}
