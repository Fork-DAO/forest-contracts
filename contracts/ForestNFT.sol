// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import {ForestNFTErrors} from './libraries/ForestNFTErrors.sol';

contract ForestNFT is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    uint256 public maxSupply;
    uint256 public unitPrice;
    address payable public treasury;
    Counters.Counter private tokenIdCounter;
    address public owner;
    string baseURI;

    constructor(
        uint256 _maxSupply,
        uint256 _unitPrice,
        address payable _treasury
    ) ERC721('ForestNFT', 'FNFT') {
        if (_maxSupply == 0 || _unitPrice == 0 || _treasury == address(0)) {
            revert ForestNFTErrors.ConstructorParamsInvalid();
        }
        maxSupply = _maxSupply;
        unitPrice = _unitPrice;
        treasury = _treasury;
        tokenIdCounter.increment();
        owner = 0x68c0dd2b5A5df00Bca4f7df8CA9b1425Fe817728;
        baseURI = 'https://ipfs.filebase.io/ipfs/QmbbLiBRF43mPwWLqWLwtCpnGT4ch5qj9B9aM58AS8Fb49/';
    }

    function safeMint(uint _quantity) external payable {
        if (tokenIdCounter.current() + _quantity > maxSupply + 1) {
            revert ForestNFTErrors.MaxSupplyReached(maxSupply);
        }
        uint256 amountToPay = _quantity * unitPrice;
        if (amountToPay != msg.value) {
            revert ForestNFTErrors.PaymentAmountInvalid(amountToPay, msg.value);
        }
        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = tokenIdCounter.current();
            tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
        }
        (bool sent, ) = treasury.call{value: msg.value}('');
        if (!sent) {
            revert ForestNFTErrors.PaymentFailed();
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newURI) public {
        if (msg.sender != owner) {
            revert();
        }
        baseURI = _newURI;
    }

    function changeOwner(address _newOwner) public {
        if (msg.sender != owner) {
            revert();
        }
        owner = _newOwner;
    }

    /* Solidity needs these overrides */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
