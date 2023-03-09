// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './ForestPreMint.sol';
import {ForestNFTErrors} from './libraries/ForestNFTErrors.sol';

contract ForestNFT is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;
    ForestPreMint public forestPreMint;
    mapping(address => bool) private mintoors;
    string public baseURI;

    constructor(address _forestPreMint) ERC721('ForestNFT', 'FNFT') {
        forestPreMint = ForestPreMint(_forestPreMint);
        baseURI = 'https://ipfs.filebase.io/ipfs/QmPRPtysRaqgCTCvvPmcnKnDkZfUvb5NhoD1K5e8SVoLSi/';
    }

    function safeMint(address _to) public {
        if (forestPreMint.getMintByAddress(_to) == 0) {
            revert ForestNFTErrors.MintorNotAContributor(_to);
        }
        if (mintoors[_to]) {
            revert ForestNFTErrors.MintorHasAlreadyMint(_to);
        }
        uint256 mintAmount = forestPreMint.getMintByAddress(_to);
        for (uint256 i = 0; i < mintAmount; i++) {
            uint256 tokenId = tokenIdCounter.current();
            tokenIdCounter.increment();
            _safeMint(_to, tokenId);
        }
        mintoors[_to] = true;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
