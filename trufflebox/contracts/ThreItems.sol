// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "../client/node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../client/node_modules/openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../client/node_modules/openzeppelin-solidity/contracts/utils/Counters.sol";

contract ThreItems is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string connecTecs = "farewell";

    constructor(
    ) ERC721("ThreadsNFT", "TReN") {}

    function mintItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
    function connectionTecs() public view returns(string memory){
        return connecTecs;
    }
}