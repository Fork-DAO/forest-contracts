// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library ForestNFTErrors {
    error MintorNotAContributor(address _mintor);
    error MintorHasAlreadyMint(address _mintor);
}
