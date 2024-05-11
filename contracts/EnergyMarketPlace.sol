// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract EnergyMarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _EnergySold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => EnergyToken) private idToEnergyToken;

    struct EnergyToken {
      uint256 tokenId;
      address payable seller;
      string energyType;
      address payable owner;
    }

    event EnergyTokenCreated (
      uint256 indexed tokenId,
      address seller,
      string energyType,
      address owner
    );

    constructor() ERC721("Polygon Energy Token", "PET") {
      owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }


    function createEnergyToken(
      uint256 tokenId,
      string memory energyType
    ) private {
      require(msg.value == listingPrice, "Price must be equal to listing price");

      idToEnergyToken[tokenId] =  EnergyToken(
        tokenId,
        payable(msg.sender),
        energyType,
        payable(address(this))
      );

      _transfer(msg.sender, address(this), tokenId);
      emit EnergyTokenCreated(
        tokenId,
        msg.sender,
        energyType,
        address(this)
      );
    }


    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, string memory energyType) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();
      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createEnergyToken(newTokenId, energyType);
      return newTokenId;
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId) public payable {
      require(idToEnergyToken[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      idToEnergyToken[tokenId].seller = payable(msg.sender);
      idToEnergyToken[tokenId].owner = payable(address(this));
      _EnergySold.decrement();

      _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      address seller = idToEnergyToken[tokenId].seller;
      idToEnergyToken[tokenId].owner = payable(msg.sender);
      idToEnergyToken[tokenId].seller = payable(address(0));
      _EnergySold.increment();
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchEnergyTokens() public view returns (EnergyToken[] memory) {
      uint itemCount = _tokenIds.current();
      uint unsoldItemCount = _tokenIds.current() - _EnergySold.current();
      uint currentIndex = 0;

      EnergyToken[] memory items = new EnergyToken[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToEnergyToken[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          EnergyToken storage currentItem = idToEnergyToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyEnergyTokens() public view returns (EnergyToken[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToEnergyToken[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      EnergyToken[] memory items = new EnergyToken[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToEnergyToken[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          EnergyToken memory currentItem = idToEnergyToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (EnergyToken[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToEnergyToken[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      EnergyToken[] memory items = new EnergyToken[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToEnergyToken[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          EnergyToken storage currentItem = idToEnergyToken[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}
