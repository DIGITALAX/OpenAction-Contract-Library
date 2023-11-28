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
    string public symbol;
    string public name;
    address public fiatPKPAddress;

    error InvalidAddress();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(
        address _printAccessControlAddress,
        address _printSplitsDataAddress,
        address _printOrderDataAddress,
        address _collectionCreatorAddress,
        address _printDesignDataAddress,
        address _fiatPKPAddress
    ) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printOrderData = PrintOrderData(_printOrderDataAddress);
        collectionCreator = CollectionCreator(_collectionCreatorAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        fiatPKPAddress = _fiatPKPAddress;
        symbol = "MCR";
        name = "MarketCreator";
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

    function setFiatPKPAddress(address _newFiatPKPAddress) public onlyAdmin {
        fiatPKPAddress = _newFiatPKPAddress;
    }

    function setPrintSplitsDataAddress(
        address _newPrintSplitsDataAddress
    ) public onlyAdmin {
        printSplitsData = PrintSplitsData(_newPrintSplitsDataAddress);
    }

    function buyTokens(PrintLibrary.BuyTokensParams memory _params) external {
        if (
            !printAccessControl.isOpenAction(msg.sender) &&
            msg.sender != fiatPKPAddress
        ) {
            revert InvalidAddress();
        }

        uint256[] memory _prices = new uint256[](_params.collectionIds.length);

        address _buyerAddress = _params.buyerAddress;
        if (msg.sender == fiatPKPAddress && _params.withPKP) {
            _buyerAddress = _params.pkpAddress;
        }

        collectionCreator.purchaseAndMintToken(
            _params.collectionIds,
            _params.collectionAmounts,
            _params.collectionIndexes,
            _buyerAddress,
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

            uint256 _price = printDesignData.getCollectionPrices(
                _params.collectionIds[i]
            )[_params.collectionIndexes[i]] * _params.collectionAmounts[i];

            address _fulfiller = printDesignData.getCollectionFulfiller(
                _params.collectionIds[i]
            );

            printOrderData.createSubOrder(
                _tokenIdsOrder,
                _fulfiller,
                _buyerAddress,
                _params.collectionAmounts[i],
                printOrderData.getOrderSupply() + 1,
                _price,
                _params.collectionIds[i]
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
            _buyerAddress,
            _params.pubId,
            _params.profileId,
            _params.buyerProfileId,
            _totalPrice,
            _params.withPKP
        );
    }

    function buyTokensOnlyNFT(
        PrintLibrary.BuyTokensOnlyNFTParams memory _params
    ) external {
        if (!printAccessControl.isOpenAction(msg.sender)) {
            revert InvalidAddress();
        }

        collectionCreator.purchaseAndMintToken(
            _oneItem(_params.collectionId),
            _oneItem(_params.quantity),
            new uint256[](1),
            _params.buyerAddress,
            _params.chosenCurrency
        );

        uint256 _price = printDesignData.getCollectionPrices(
            _params.collectionId
        )[0] * _params.quantity;

        uint256[] memory _tokenIds = printDesignData.getCollectionTokenIds(
            _params.collectionId
        );

        uint256[] memory _tokenIdsOrder = new uint256[](_params.quantity);
        for (uint256 j = 0; j < _params.quantity; j++) {
            _tokenIdsOrder[j] = _tokenIds[
                _tokenIds.length - _params.quantity + j
            ];
        }

        printOrderData.createNFTOnlyOrder(
            _tokenIdsOrder,
            _params.chosenCurrency,
            _params.buyerAddress,
            _params.pubId,
            _params.profileId,
            _params.buyerProfileId,
            _price,
            _params.collectionId,
            _params.quantity
        );
    }

    function _oneItem(uint256 _value) private pure returns (uint256[] memory) {
        uint256[] memory _arr = new uint256[](1);
        _arr[0] = _value;

        return _arr;
    }
}
