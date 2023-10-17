// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./NFTCreator.sol";
import "./CollectionCreator.sol";
import "./PrintLibrary.sol";

contract PrintDesignData {
    PrintAccessControl public printAccessControl;
    CollectionCreator public collectionCreator;
    NFTCreator public nftCreator;
    uint256 private _collectionSupply;
    uint256 private _tokenSupply;

    mapping(uint256 => PrintLibrary.Collection) private _collections;
    mapping(uint256 => PrintLibrary.Token) private _tokens;

    error invalidAddress();

    event TokensMinted(uint256 indexed tokenId, uint256 collectionId);
    event CollectionCreated(
        uint256 indexed collectionId,
        string uri,
        uint256 amount,
        address owner
    );
    event CollectionUpdated(uint256 indexed collectionId);
    event CollectionMintedTokensSet(
        uint256 indexed collectionId,
        uint256 mintedTokensAmount
    );
    event CollectionTokenIdsSet(
        uint256 indexed collectionId,
        uint256[] tokenIds
    );

    modifier onlyCollectionCreator() {
        if (msg.sender != address(collectionCreator)) {
            revert invalidAddress();
        }
        _;
    }
    modifier onlyNFTCreator() {
        if (msg.sender != address(nftCreator)) {
            revert invalidAddress();
        }
        _;
    }
    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert invalidAddress();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        _collectionSupply = 0;
        _tokenSupply = 0;
    }

    function setCollection(
        PrintLibrary.Collection memory _collectionData
    ) external onlyCollectionCreator {
        _collectionSupply++;

        _collections[_collectionSupply] = _collectionData;

        emit CollectionCreated(
            _collectionData.collectionId,
            _collectionData.uri,
            _collectionData.amount,
            _collectionData.creator
        );
    }

    function setCollectionMintedTokens(
        uint256 _collectionId,
        uint256 _mintedTokens
    ) external onlyCollectionCreator {
        _collections[_collectionId].mintedTokens += _mintedTokens;

        emit CollectionMintedTokensSet(
            _collectionId,
            _collections[_collectionId].mintedTokens
        );
    }

    function setCollectionTokenIds(
        uint256 _collectionId,
        uint256[] memory _newTokenIds
    ) external onlyCollectionCreator {
        _collections[_collectionId].tokenIds = _concatenate(
            _collections[_collectionId].tokenIds,
            _newTokenIds
        );

        emit CollectionTokenIdsSet(
            _collectionId,
            _collections[_collectionId].tokenIds
        );
    }

    function updateCollection(
        uint256 _collectionId,
        PrintLibrary.MintParams memory _params
    ) external onlyAdmin {
        uint256 _amount = _params.amount;
        if (_params.unlimited) {
            _amount = type(uint256).max;
        }

        PrintLibrary.Collection memory _currentCollection = _collections[
            _collectionId
        ];

        _currentCollection.prices = _params.prices;
        _currentCollection.amount = _amount;
        _currentCollection.unlimited = _params.unlimited;
        _currentCollection.uri = _params.uri;
        _currentCollection.printType = _params.printType;

        emit CollectionUpdated(_collectionId);
    }

    function setNFT(
        PrintLibrary.Token memory _tokenData
    ) external onlyNFTCreator returns (uint256) {
        _tokenSupply++;

        _tokens[_tokenSupply] = _tokenData;

        emit TokensMinted(_tokenSupply, _tokens[_tokenSupply].collectionId);

        return _tokenSupply;
    }

    function getCollectionCreator(
        uint256 _collectionId
    ) public view returns (address) {
        return _collections[_collectionId].creator;
    }

    function getCollectionURI(
        uint256 _collectionId
    ) public view returns (string memory) {
        return _collections[_collectionId].uri;
    }

    function getCollectionPrices(
        uint256 _collectionId
    ) public view returns (uint256[] memory) {
        return _collections[_collectionId].prices;
    }

    function getCollectionPrintType(
        uint256 _collectionId
    ) public view returns (PrintLibrary.PrintType) {
        return _collections[_collectionId].printType;
    }

    function getCollectionFulfiller(
        uint256 _collectionId
    ) public view returns (address) {
        return _collections[_collectionId].fulfiller;
    }

    function getCollectionTokenIds(
        uint256 _collectionId
    ) public view returns (uint256[] memory) {
        return _collections[_collectionId].tokenIds;
    }

    function getCollectionTokensMinted(
        uint256 _collectionId
    ) public view returns (uint256) {
        return _collections[_collectionId].mintedTokens;
    }

    function getCollectionSupply() public view returns (uint256) {
        return _collectionSupply;
    }

    function getTokenSupply() public view returns (uint256) {
        return _tokenSupply;
    }

    function getTokenCollection(
        uint256 _tokenId
    ) public view returns (uint256) {
        return _tokens[_tokenId].collectionId;
    }

    function getTokenId(uint256 _tokenId) public view returns (uint256) {
        return _tokens[_tokenId].tokenId;
    }

    function getTokenIndex(uint256 _tokenId) public view returns (uint256) {
        return _tokens[_tokenId].index;
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        return _tokens[_tokenId].uri;
    }

    function _concatenate(
        uint256[] memory _originalArray,
        uint256[] memory _newArray
    ) internal pure returns (uint256[] memory) {
        uint256[] memory result = new uint256[](
            _originalArray.length + _newArray.length
        );
        uint256 i;
        for (i = 0; i < _originalArray.length; i++) {
            result[i] = _originalArray[i];
        }
        for (uint256 j = 0; j < _newArray.length; j++) {
            result[i++] = _newArray[j];
        }
        return result;
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function setCollectionCreatorAddress(
        address _newCollectionCreatorAddress
    ) public onlyAdmin {
        collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
    }

    function setNFTCreatorAddress(
        address _newNFTCreatorAddress
    ) public onlyAdmin {
        nftCreator = NFTCreator(_newNFTCreatorAddress);
    }
}
