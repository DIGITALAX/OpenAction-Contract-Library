// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintOrderData.sol";
import "./CollectionCreator.sol";
import "./PrintSplitsData.sol";
import "./PrintDesignData.sol";

contract MarketCreator {
    PrintAccessControl public printAccessControl;
    PrintOrderData public printOrderData;
    CollectionCreator public collectionCreator;
    PrintSplitsData public printSplitsData;
    PrintDesignData public printDesignData;

    error invalidAddress();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert invalidAddress();
        }
        _;
    }

    constructor(
        address _printAccessControlAddress,
        address _printSplitsDataAddress,
        address _printOrderDataAddress,
        address _collectionCreatorAddress,
        address _printDesignDataAddress
    ) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printOrderData = PrintOrderData(_printOrderDataAddress);
        collectionCreator = CollectionCreator(_collectionCreatorAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function setPrintOrderDataAddress(
        address _newPrintOrderDataAddress
    ) public onlyAdmin {
        printOrderData = PrintOrderData(_newPrintOrderDataAddress);
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printDesignData = PrintDesignData(_newPrintDesignDataAddress);
    }

    function setCollectionCreatorAddress(
        address _newCollectionCreatorAddress
    ) public onlyAdmin {
        collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
    }

    function setPrintSplitsDataAddress(
        address _newPrintSplitsDataAddress
    ) public onlyAdmin {
        printSplitsData = PrintSplitsData(_newPrintSplitsDataAddress);
    }

    function buyTokens(PrintLibrary.BuyTokensParams memory _params) external {
        if (!printAccessControl.isOpenAction(msg.sender)) {
            revert invalidAddress();
        }

        uint256[] memory _prices = new uint256[](_params.collectionIds.length);

        collectionCreator.purchaseAndMintToken(
            _params.collectionIds,
            _params.collectionAmounts,
            _params.collectionIndexes,
            _params.buyerAddress,
            _params.chosenCurrency
        );

        for (uint256 i = 0; i < _params.collectionIds.length; i++) {
            uint256[] memory _tokenIds = printDesignData.getCollectionTokenIds(
                _params.collectionIds[i]
            );

            uint256[] memory _tokenIdsOrder = new uint256[](
                _params.collectionAmounts[i]
            );
            for (uint256 j = 0; j < _params.collectionAmounts[i]; j++) {
                _tokenIdsOrder[j] = _tokenIds[
                    _tokenIds.length - _params.collectionAmounts[i] + j
                ];
            }

            uint256 _price = _params.collectionPrices[i] *
                _params.collectionAmounts[i];

            printOrderData.createSubOrder(
                _tokenIdsOrder,
                _params.fulfillers[i],
                _params.collectionAmounts[i],
                printOrderData.getOrderSupply() + 1,
                _price
            );

            _prices[i] = _price;
        }

        uint256 _totalPrice = 0;

        for (uint256 i = 0; i < _prices.length; i++) {
            _totalPrice += _prices[i];
        }

        uint256[] memory _subOrderIds = new uint256[](
            _params.collectionIds.length
        );
        for (uint256 i = 0; i < _params.collectionIds.length; i++) {
            _subOrderIds[i] = printOrderData.getSubOrderSupply() - i;
        }

        printOrderData.createOrder(
            _subOrderIds,
            _params.details,
            _params.chosenCurrency,
            _params.buyerAddress,
            _params.pubId,
            _params.profileId,
            _totalPrice
        );
    }
}
