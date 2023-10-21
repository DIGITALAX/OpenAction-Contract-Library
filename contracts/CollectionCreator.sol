// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./NFTCreator.sol";
import "./PrintDesignData.sol";
import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";

contract CollectionCreator {
    PrintDesignData public printData;
    PrintAccessControl public printAccessControl;
    NFTCreator public nftCreator;
    address public marketCreator;

    error AddressNotMarket();
    error AddressNotDesigner();
    error AddressNotAdmin();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert AddressNotAdmin();
        }
        _;
    }

    constructor(
        address _nftCreatorAddress,
        address _printDataAddress,
        address _printAccessControlAddress
    ) {
        nftCreator = NFTCreator(_nftCreatorAddress);
        printData = PrintDesignData(_printDataAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
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
            collectionId: printData.getCollectionSupply() + 1,
            prices: _params.prices,
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

        uint256 _collectionId = printData.setCollection(newCollection);

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
        uint256 _initialSupply = printData.getTokenSupply();

        for (uint256 i = 0; i < _collectionIds.length; i++) {
            nftCreator.mintBatch(
                printData.getCollectionURI(_collectionIds[i]),
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

            printData.setCollectionMintedTokens(
                _collectionIds[i],
                _mintedTokens
            );
            printData.setCollectionTokenIds(_collectionIds[i], _newTokenIds);
        }
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printData = PrintDesignData(_newPrintDesignDataAddress);
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
