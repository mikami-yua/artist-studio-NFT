// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract ArtistNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;

    // 每次分配一个tokenid 铸造一个token
    Counters.Counter private _tokenIds;

    constructor() ERC721("ArtistNFT", "AN") {
    }
    function _increaseBalance(address account, uint128 value) internal override (ERC721, ERC721Enumerable){
        super._increaseBalance(account,value);

    }
    function _update(address to, uint256 tokenId, address auth) internal override (ERC721, ERC721Enumerable) returns (address) {
        super._update(to, tokenId, auth);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // 获取tokenURI
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // 铸币，新发行一个NFT资产
    function mint(address artist, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();//拿到tokenids计数器当前的值

        // 调用erc721父合约的mint函数
        _mint(artist, newItemId);
        // 设置tokenURI
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();// 计数器递增
        return newItemId;
    }
}
