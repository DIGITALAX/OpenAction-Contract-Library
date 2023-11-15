// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./NFTCreator.sol";
import "./PrintDesignData.sol";
import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";

contract CollectionCreator {
    PrintDesignData public printDesignData;
    PrintAccessControl public printAccessControl;
    NFTCreator public nftCreator;
    string public symbol;
    string public name;
    address public marketCreator;

    error AddressNotMarket();
    error AddressNotDesigner();
    error AddressNotAdmin();
    error InvalidUpdate();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert AddressNotAdmin();
        }
        _;
    }

    modifier onlyDesigner() {
        if (!printAccessControl.isDesigner(msg.sender)) {
            revert AddressNotDesigner();
        }
        _;
    }

    constructor(
        address _nftCreatorAddress,
        address _printDesignDataAddress,
        address _printAccessControlAddress
    ) {
        nftCreator = NFTCreator(_nftCreatorAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        symbol = "CCR";
        name = "CollectionCreator";
    }

    function createCollection(
        PrintLibrary.MintParams memory _params
    ) external returns (uint256) {
        if (
            !printAccessControl.isDesigner(msg.sender) ||
            !printAccessControl.isOpenAction(msg.sender)
        ) {
            revert AddressNotDesigner();
        }
        uint256 _amount = _params.amount;
        if (_params.unlimited) {
            _amount = type(uint256).max;
        }
        PrintLibrary.Collection memory newCollection = PrintLibrary.Collection({
            collectionId: printDesignData.getCollectionSupply() + 1,
            prices: _params.prices,
            acceptedTokens: _params.acceptedTokens,
            communityIds: _params.communityIds,
            amount: _amount,
            pubId: _params.pubId,
            profileId: _params.profileId,
            dropId: _params.dropId,
            tokenIds: new uint256[](0),
            mintedTokens: 0,
            fulfiller: _params.fulfiller,
            creator: _params.creator,
            uri: _params.uri,
            printType: _params.printType,
            origin: _params.origin,
            unlimited: _params.unlimited
        });

        uint256 _collectionId = printDesignData.setCollection(newCollection);
        string memory _uri = printDesignData.getDropURI(_params.dropId);
        uint256[] memory _collectionIds = printDesignData.getDropCollectionIds(
            _params.dropId
        );
        uint256[] memory _newCollectionIds = new uint256[](
            _collectionIds.length + 1
        );
        for (uint i = 0; i < _collectionIds.length; i++) {
            _newCollectionIds[i] = _collectionIds[i];
        }
        _newCollectionIds[_collectionIds.length] = _collectionId;

        updateDrop(_newCollectionIds, _uri, _params.dropId);

        return _collectionId;
    }

    function purchaseAndMintToken(
        uint256[] memory _collectionIds,
        uint256[] memory _amounts,
        uint256[] memory _chosenIndexes,
        address _purchaserAddress,
        address _chosenCurrency
    ) external {
        if (msg.sender != marketCreator) {
            revert AddressNotMarket();
        }
        uint256 _initialSupply = printDesignData.getTokenSupply();

        for (uint256 i = 0; i < _collectionIds.length; i++) {
            nftCreator.mintBatch(
                printDesignData.getCollectionURI(_collectionIds[i]),
                _purchaserAddress,
                _chosenCurrency,
                _amounts[i],
                _collectionIds[i],
                _chosenIndexes[i]
            );

            uint256[] memory _newTokenIds = new uint256[](_amounts[i]);
            uint256 _mintedTokens = 0;
            for (uint256 j = 0; j < _amounts[i]; j++) {
                uint256 tokenId = _initialSupply + j + 1;
                _newTokenIds[j] = tokenId;
                _mintedTokens++;
            }

            printDesignData.setCollectionMintedTokens(
                _collectionIds[i],
                _mintedTokens
            );
            printDesignData.setCollectionTokenIds(
                _collectionIds[i],
                _newTokenIds
            );
        }
    }

    function updateCollection(
        uint256 _collectionId,
        PrintLibrary.MintParams memory _params
    ) public onlyDesigner {
        if (msg.sender != printDesignData.getCollectionCreator(_collectionId)) {
            revert AddressNotDesigner();
        }

        uint256 _amount = _params.amount;
        if (_params.unlimited) {
            _amount = type(uint256).max;
        }

        uint256 _oldDropId = printDesignData.getCollectionDropId(_collectionId);

        bool _sameDrop = _params.dropId == _oldDropId;

        if (!_sameDrop) {
            _updateDropStatus(_oldDropId, _collectionId, _params.dropId);
        }

        PrintLibrary.Collection memory _collection = PrintLibrary.Collection({
            collectionId: _collectionId,
            prices: _params.prices,
            acceptedTokens: _params.acceptedTokens,
            communityIds: _params.communityIds,
            amount: _amount,
            pubId: _params.pubId,
            profileId: _params.profileId,
            dropId: _params.dropId,
            tokenIds: printDesignData.getCollectionTokenIds(_collectionId),
            mintedTokens: printDesignData.getCollectionTokensMinted(
                _collectionId
            ),
            fulfiller: _params.fulfiller,
            creator: _params.creator,
            uri: _params.uri,
            printType: _params.printType,
            origin: _params.origin,
            unlimited: _params.unlimited
        });

        printDesignData.modifyCollection(_collectionId, _collection);
    }

    function removeCollection(uint256 _collectionId) public onlyDesigner {
        if (printDesignData.getCollectionCreator(_collectionId) != msg.sender) {
            revert AddressNotDesigner();
        }

        uint256 _dropId = printDesignData.getCollectionDropId(_collectionId);
        uint256[] memory _collectionIds = printDesignData.getDropCollectionIds(
            _dropId
        );
        string memory _uri = printDesignData.getDropURI(_dropId);
        uint256[] memory _newIds = new uint256[](_collectionIds.length - 1);
        uint256 j = 0;

        for (uint256 i = 0; i < _collectionIds.length; i++) {
            if (_collectionIds[i] != _collectionId) {
                _newIds[j] = _collectionIds[i];
                j++;
            }
        }

        printDesignData.modifyCollectionsInDrop(_newIds, _uri, _dropId);

        printDesignData.deleteCollection(_collectionId);
    }

    function createDrop(string memory _uri) public onlyDesigner {
        printDesignData.createDrop(_uri, msg.sender);
    }

    function updateDrop(
        uint256[] memory _collectionIds,
        string memory _uri,
        uint256 _dropId
    ) public onlyDesigner {
        if (bytes(printDesignData.getDropURI(_dropId)).length == 0) {
            revert InvalidUpdate();
        }

        if (msg.sender != address(this)) {
            if (printDesignData.getDropCreator(_dropId) != msg.sender) {
                revert InvalidUpdate();
            }

            for (uint256 i = 0; i < _collectionIds.length; i++) {
                if (
                    printDesignData.getCollectionCreator(_collectionIds[i]) !=
                    msg.sender
                ) {
                    revert AddressNotDesigner();
                }
            }
        }

        printDesignData.modifyCollectionsInDrop(_collectionIds, _uri, _dropId);
    }

    function removeDrop(uint256 _dropId) public onlyDesigner {
        if (
            bytes(printDesignData.getDropURI(_dropId)).length == 0 ||
            printDesignData.getDropCreator(_dropId) != msg.sender
        ) {
            revert InvalidUpdate();
        }
        printDesignData.deleteDrop(_dropId);
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printDesignData = PrintDesignData(_newPrintDesignDataAddress);
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function setNFTCreatorAddress(
        address _newNFTCreatorAddress
    ) public onlyAdmin {
        nftCreator = NFTCreator(_newNFTCreatorAddress);
    }

    function setMarketCreatorAddress(
        address _newMarketCreatorAddress
    ) public onlyAdmin {
        marketCreator = _newMarketCreatorAddress;
    }

    function _updateDropStatus(
        uint256 _oldDropId,
        uint256 _collectionId,
        uint256 _paramsDropId
    ) internal {
        uint256[] memory _currentIds = printDesignData.getDropCollectionIds(
            _oldDropId
        );

        uint256[] memory _remove = new uint256[](_currentIds.length - 1);
        uint256 j = 0;

        for (uint256 i = 0; i < _currentIds.length; i++) {
            if (_currentIds[i] != _collectionId) {
                _remove[j] = _currentIds[i];
                j++;
            }
        }

        uint256[] memory _newDropIds = printDesignData.getDropCollectionIds(
            _paramsDropId
        );
        uint256[] memory _newCollectionIds = new uint256[](
            _newDropIds.length + 1
        );
        for (uint i = 0; i < _newDropIds.length; i++) {
            _newCollectionIds[i] = _newDropIds[i];
        }
        _newCollectionIds[_newDropIds.length] = _collectionId;

        updateDrop(_remove, printDesignData.getDropURI(_oldDropId), _oldDropId);
        updateDrop(
            _newCollectionIds,
            printDesignData.getDropURI(_paramsDropId),
            _paramsDropId
        );
    }
}
