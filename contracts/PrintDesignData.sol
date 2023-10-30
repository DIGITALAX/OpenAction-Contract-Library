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
    string public symbol;
    string public name;
    uint256 private _collectionSupply;
    uint256 private _dropSupply;
    uint256 private _tokenSupply;

    mapping(uint256 => PrintLibrary.Collection) private _collections;
    mapping(uint256 => PrintLibrary.Drop) private _drops;
    mapping(uint256 => PrintLibrary.Token) private _tokens;
    mapping(uint256 => mapping(address => bool)) private _acceptedTokens;

    error InvalidAddress();

    event TokensMinted(uint256 indexed tokenId, uint256 collectionId);
    event CollectionCreated(
        uint256 indexed collectionId,
        uint256 pubId,
        uint256 profileId,
        string uri,
        uint256 amount,
        address owner
    );
    event DropCollectionsUpdated(
        uint256 dropId,
        uint256[] collectionIds,
        string uri
    );
    event DropCreated(uint256 dropId, string uri, address creator);
    event DropDeleted(uint256 dropId);
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
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyNFTCreator() {
        if (msg.sender != address(nftCreator)) {
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        _collectionSupply = 0;
        _tokenSupply = 0;
        _dropSupply = 0;
        symbol = "PDD";
        name = "PrintDesignData";
    }

    function setCollection(
        PrintLibrary.Collection memory _collectionData
    ) external onlyCollectionCreator returns (uint256) {
        _collectionSupply++;

        _collections[_collectionSupply] = _collectionData;

        for (uint256 i = 0; i < _collectionData.acceptedTokens.length; i++) {
            _acceptedTokens[_collectionSupply][
                _collectionData.acceptedTokens[i]
            ] = true;
        }

        emit CollectionCreated(
            _collectionData.collectionId,
            _collectionData.pubId,
            _collectionData.profileId,
            _collectionData.uri,
            _collectionData.amount,
            _collectionData.creator
        );

        return _collectionSupply;
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

        for (uint256 i = 0; i < _currentCollection.acceptedTokens.length; i++) {
            _acceptedTokens[_collectionSupply][
                _currentCollection.acceptedTokens[i]
            ] = false;
        }

        for (uint256 i = 0; i < _params.acceptedTokens.length; i++) {
            _acceptedTokens[_collectionSupply][
                _params.acceptedTokens[i]
            ] = false;
        }

        _currentCollection.prices = _params.prices;
        _currentCollection.acceptedTokens = _params.acceptedTokens;
        _currentCollection.amount = _amount;
        _currentCollection.creator = _params.creator;
        _currentCollection.unlimited = _params.unlimited;
        _currentCollection.uri = _params.uri;
        _currentCollection.printType = _params.printType;
        _currentCollection.origin = _params.origin;
        _currentCollection.pubId = _params.pubId;
        _currentCollection.profileId = _params.profileId;
        _currentCollection.fulfiller = _params.fulfiller;
        _currentCollection.communityIds = _params.communityIds;

        emit CollectionUpdated(_collectionId);
    }

    function createDrop(
        uint256[] memory _collectionIds,
        string memory _uri,
        address _creator
    ) external onlyCollectionCreator {
        _dropSupply++;

        _drops[_dropSupply] = PrintLibrary.Drop({
            dropId: _dropSupply,
            collectionIds: _collectionIds,
            uri: _uri,
            creator: _creator
        });

        emit DropCreated(_dropSupply, _uri, _creator);
    }

    function deleteDrop(uint256 _dropId) external onlyCollectionCreator {
        delete _drops[_dropId];

        emit DropDeleted(_dropId);
    }

    function modifyCollectionsInDrop(
        uint256[] memory _collectionIds,
        string memory _uri,
        uint256 _dropId
    ) external onlyCollectionCreator {
        _drops[_dropId].collectionIds = _collectionIds;
        _drops[_dropId].uri = _uri;

        emit DropCollectionsUpdated(_dropId, _collectionIds, _uri);
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

    function getCollectionCommunityIds(
        uint256 _collectionId
    ) public view returns (uint256[] memory) {
        return _collections[_collectionId].communityIds;
    }

    function getCollectionAcceptedTokens(
        uint256 _collectionId
    ) public view returns (address[] memory) {
        return _collections[_collectionId].acceptedTokens;
    }

    function getIsCollectionTokenAccepted(
        uint256 _collectionId,
        address _tokenAddress
    ) public view returns (bool) {
        return _acceptedTokens[_collectionId][_tokenAddress];
    }

    function getCollectionOrigin(
        uint256 _collectionId
    ) public view returns (PrintLibrary.Origin) {
        return _collections[_collectionId].origin;
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

    function getCollectionAmount(
        uint256 _collectionId
    ) public view returns (uint256) {
        return _collections[_collectionId].amount;
    }

    function getCollectionUnlimited(
        uint256 _collectionId
    ) public view returns (bool) {
        return _collections[_collectionId].unlimited;
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

    function getCollectionProfileId(
        uint256 _collectionId
    ) public view returns (uint256) {
        return _collections[_collectionId].profileId;
    }

    function getCollectionPubId(
        uint256 _collectionId
    ) public view returns (uint256) {
        return _collections[_collectionId].pubId;
    }

    function getCollectionSupply() public view returns (uint256) {
        return _collectionSupply;
    }

    function getTokenSupply() public view returns (uint256) {
        return _tokenSupply;
    }

    function getDropSupply() public view returns (uint256) {
        return _dropSupply;
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

    function getDropURI(uint256 _dropId) public view returns (string memory) {
        return _drops[_dropId].uri;
    }

    function getDropCreator(uint256 _dropId) public view returns (address) {
        return _drops[_dropId].creator;
    }

    function getDropCollectionIds(
        uint256 _dropId
    ) public view returns (uint256[] memory) {
        return _drops[_dropId].collectionIds;
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
