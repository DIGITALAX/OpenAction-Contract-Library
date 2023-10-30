// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {IModuleGlobals} from "./../lens/v2/interfaces/IModuleGlobals.sol";
import "./../MarketCreator.sol";
import "./../CollectionCreator.sol";
import "./../PrintAccessControl.sol";
import "./../PrintDesignData.sol";
import "./../PrintCommunityData.sol";

contract ListenerOpenAction is HubRestricted, IPublicationActionModule {
    MarketCreator public marketCreator;
    CollectionCreator public collectionCreator;
    PrintAccessControl public printAccessControl;
    PrintSplitsData public printSplitsData;
    PrintDesignData public printDesignData;
    PrintCommunityData public printCommunityData;

    error CurrencyNotWhitelisted();
    error InvalidAddress();
    error InvalidAmounts();
    error InvalidCommunityMember();

    struct CollectionInfo {
        uint256[] collectionIds;
        uint256[] amounts;
    }

    mapping(uint256 => mapping(uint256 => CollectionInfo)) _collectionGroups;

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    IModuleGlobals public immutable MODULE_GLOBALS;

    event ListenerPurchased(
        address buyerAddress,
        uint256[] collectionIds,
        uint256 pubId,
        uint256 profileId,
        uint256 totalAmount
    );
    event ListenerInitialized(
        uint256[] collectionIds,
        uint256 profileId,
        uint256 pubId,
        address creatorAddress,
        uint256 numberOfCollections
    );

    constructor(
        address _hub,
        address _moduleGlobals,
        address _printAccessControlAddress,
        address _printSplitsDataAddress,
        address _printDesignDataAddress,
        address _marketCreatorAddress,
        address _collectionCreatorAddress,
        address _printCommunityDataAddress
    ) HubRestricted(_hub) {
        MODULE_GLOBALS = IModuleGlobals(_moduleGlobals);
        marketCreator = MarketCreator(_marketCreatorAddress);
        collectionCreator = CollectionCreator(_collectionCreatorAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        printCommunityData = PrintCommunityData(_printCommunityDataAddress);
    }

    function initializePublicationAction(
        uint256 _profileId,
        uint256 _pubId,
        address _executor,
        bytes calldata _data
    ) external override onlyHub returns (bytes memory) {
        (
            PrintLibrary.CollectionValuesParams memory _collectionCreator,
            PrintLibrary.PrintType[] memory _printTypes
        ) = abi.decode(
                _data,
                (PrintLibrary.CollectionValuesParams, PrintLibrary.PrintType[])
            );

        if (!printAccessControl.isDesigner(_collectionCreator.creatorAddress)) {
            revert InvalidAddress();
        }

        if (
            _collectionCreator.prices.length !=
            _collectionCreator.uris.length ||
            _collectionCreator.fulfillers.length !=
            _collectionCreator.amounts.length ||
            _collectionCreator.unlimiteds.length !=
            _collectionCreator.prices.length ||
            _collectionCreator.fulfillers.length != _printTypes.length
        ) {
            revert InvalidAmounts();
        }

        uint256[] memory _collectionIds = _configureCollection(
            _collectionCreator,
            _printTypes,
            _pubId,
            _profileId
        );

        _collectionGroups[_profileId][_pubId] = CollectionInfo({
            collectionIds: _collectionIds,
            amounts: _collectionCreator.amounts
        });

        emit ListenerInitialized(
            _collectionIds,
            _profileId,
            _pubId,
            _collectionCreator.creatorAddress,
            _collectionCreator.prices.length
        );

        return _data;
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata _params
    ) external override onlyHub returns (bytes memory) {
        (
            uint256[] memory _chosenIndexes,
            string memory _encryptedFulfillment,
            address _currency,
            bool _fiat
        ) = abi.decode(
                _params.actionModuleData,
                (uint256[], string, address, bool)
            );

        if (
            !MODULE_GLOBALS.isCurrencyWhitelisted(_currency) ||
            !printSplitsData.getIsCurrency(_currency)
        ) {
            revert CurrencyNotWhitelisted();
        }

        uint256[] memory _collectionIds = _collectionGroups[
            _params.publicationActedProfileId
        ][_params.publicationActedId].collectionIds;

        uint256 _grandTotal = 0;

        bool _isVerified = false;

        if (_fiat) {
            _isVerified = printAccessControl.isVerifiedFiat(
                _params.actorProfileOwner,
                _params.publicationActedProfileId,
                _params.publicationActedId
            );
        }

        for (uint256 i; i < _collectionIds.length; i++) {
            if (
                !printDesignData.getIsCollectionTokenAccepted(
                    _collectionIds[i],
                    _currency
                )
            ) {
                revert CurrencyNotWhitelisted();
            }

            if (!_checkCommunity(_collectionIds[i], _params.actorProfileId)) {
                revert InvalidCommunityMember();
            }

            address _designer = printDesignData.getCollectionCreator(
                _collectionIds[i]
            );
            if (!_isVerified) {
                _grandTotal += _transferTokens(
                    _collectionIds[i],
                    _chosenIndexes[i],
                    _designer,
                    _currency,
                    _params.actorProfileOwner
                );
            }
        }

        PrintLibrary.BuyTokensParams memory _buyTokensParams = PrintLibrary
            .BuyTokensParams({
                collectionIds: _collectionIds,
                collectionAmounts: _collectionGroups[
                    _params.publicationActedProfileId
                ][_params.publicationActedId].amounts,
                collectionIndexes: _chosenIndexes,
                details: _encryptedFulfillment,
                buyerAddress: _params.actorProfileOwner,
                chosenCurrency: _currency,
                pubId: _params.publicationActedId,
                profileId: _params.publicationActedProfileId,
                buyerProfileId: _params.actorProfileId,
                pkpAddress: address(0),
                withPKP: _isVerified
            });

        marketCreator.buyTokens(_buyTokensParams);

        emit ListenerPurchased(
            _params.actorProfileOwner,
            _collectionIds,
            _params.publicationActedId,
            _params.publicationActedProfileId,
            _grandTotal
        );

        return abi.encode(_collectionIds, _currency, _chosenIndexes);
    }

    function _transferTokens(
        uint256 _collectionId,
        uint256 _chosenIndex,
        address _chosenCurrency,
        address _designer,
        address _buyer
    ) internal returns (uint256) {
        uint256 _totalPrice = printDesignData.getCollectionPrices(
            _collectionId
        )[_chosenIndex];
        uint256 _calculatedPrice = _calculateAmount(
            _chosenCurrency,
            _totalPrice
        );

        IERC20(_chosenCurrency).transferFrom(
            _buyer,
            _designer,
            _calculatedPrice
        );

        return _calculatedPrice;
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

    function setPrintCommunityDataAddress(
        address _newPrintCommunityDataAddress
    ) public onlyAdmin {
        printCommunityData = PrintCommunityData(_newPrintCommunityDataAddress);
    }

    function setMarketCreatorAddress(
        address _newMarketCreatorAddress
    ) public onlyAdmin {
        marketCreator = MarketCreator(_newMarketCreatorAddress);
    }

    function setCollectionCreatorAddress(
        address _newCollectionCreatorAddress
    ) public onlyAdmin {
        collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
    }

    function _configureCollection(
        PrintLibrary.CollectionValuesParams memory _collectionCreator,
        PrintLibrary.PrintType[] memory _printTypes,
        uint256 _pubId,
        uint256 _profileId
    ) internal returns (uint256[] memory) {
        uint256[] memory _collectionIds = new uint256[](
            _collectionCreator.uris.length
        );

        for (uint256 i = 0; i < _collectionCreator.uris.length; i++) {
            uint256 _id = collectionCreator.createCollection(
                PrintLibrary.MintParams({
                    prices: _collectionCreator.prices[i],
                    acceptedTokens: _collectionCreator.acceptedTokens[i],
                    communityIds: _collectionCreator.communityIds[i],
                    uri: _collectionCreator.uris[i],
                    fulfiller: _collectionCreator.fulfillers[i],
                    pubId: _pubId,
                    profileId: _profileId,
                    creator: _collectionCreator.creatorAddress,
                    printType: _printTypes[i],
                    origin: PrintLibrary.Origin.Listener,
                    amount: _collectionCreator.amounts[i],
                    unlimited: _collectionCreator.unlimiteds[i]
                })
            );
            _collectionIds[i] = _id;
        }

        return _collectionIds;
    }

    function _checkCommunity(
        uint256 _collectionId,
        uint256 _profileId
    ) internal view returns (bool) {
        uint256[] memory _communityIds = printDesignData
            .getCollectionCommunityIds(_collectionId);
        bool _validMember = false;
        if (_communityIds.length > 0) {
            for (uint256 j = 0; j < _communityIds.length; j++) {
                if (
                    printCommunityData.getIsCommunityMember(
                        _communityIds[j],
                        _profileId
                    )
                ) {
                    return _validMember = true;
                }
            }
        }

        return _validMember;
    }

    function _calculateAmount(
        address _currency,
        uint256 _amountInWei
    ) internal view returns (uint256) {
        if (_amountInWei == 0) {
            revert InvalidAmounts();
        }

        uint256 _exchangeRate = printSplitsData.getRateByCurrency(_currency);
        uint256 _weiDivisor = printSplitsData.getWeiByCurrency(_currency);

        uint256 _tokenAmount = (_amountInWei * _weiDivisor) / _exchangeRate;

        return _tokenAmount;
    }
}
