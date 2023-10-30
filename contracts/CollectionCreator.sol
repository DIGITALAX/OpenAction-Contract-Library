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

    modifier onlyCreator(uint256[] memory _collectionIds) {
        for (uint256 i = 0; i < _collectionIds.length; i++) {
            if (
                printDesignData.getCollectionCreator(_collectionIds[i]) !=
                msg.sender
            ) {
                revert AddressNotDesigner();
            }
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

    function createDrop(
        uint256[] memory _collectionIds,
        string memory _uri
    ) public onlyCreator(_collectionIds) {
        printDesignData.createDrop(_collectionIds, _uri, msg.sender);
    }

    function updateDrop(
        uint256[] memory _collectionIds,
        string memory _uri,
        uint256 _dropId
    ) public onlyCreator(_collectionIds) {
        if (
            printDesignData.getDropCollectionIds(_dropId).length < 1 ||
            printDesignData.getDropCreator(_dropId) != msg.sender
        ) {
            revert InvalidUpdate();
        }
        printDesignData.modifyCollectionsInDrop(_collectionIds, _uri, _dropId);
    }

    function removeDrop(uint256 _dropId) public {
        if (
            printDesignData.getDropCollectionIds(_dropId).length < 1 ||
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
}
