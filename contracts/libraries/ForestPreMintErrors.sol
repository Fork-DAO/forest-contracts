// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library ForestPreMintErrors {
    error ConstructorParamsInvalid();
    error MaxSupplyReached(uint256 _maxSupply);
    error PaymentAmountInvalid(uint256 _expectedPaymentAmount, uint256 _actualPaymentAmount);
    error PaymentFailed();
}
