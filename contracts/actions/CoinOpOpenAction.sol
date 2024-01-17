// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {ILensModule} from "./../lens/v2/interfaces/ILensModule.sol";
import {IModuleRegistry} from "./../lens/v2/interfaces/IModuleRegistry.sol";
import "./../MarketCreator.sol";
import "./../CollectionCreator.sol";
import "./../PrintAccessControl.sol";
import "./../PrintDesignData.sol";
import "./../PrintCommunityData.sol";

contract CoinOpOpenAction is
    HubRestricted,
    ILensModule,
    IPublicationActionModule
{
    MarketCreator public marketCreator;
    CollectionCreator public collectionCreator;
    PrintAccessControl public printAccessControl;
    PrintSplitsData public printSplitsData;
    PrintDesignData public printDesignData;
    PrintCommunityData public printCommunityData;
    string private _metadata;

    error CurrencyNotWhitelisted();
    error InvalidAddress();
    error InvalidAmounts();
    error InvalidCommunityMember();
    error ExceedAmount();

    mapping(uint256 => mapping(uint256 => uint256)) _collectionGroups;

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    IModuleRegistry public immutable MODULE_GLOBALS;

    event CoinOpPurchased(
        address buyerAddress,
        uint256 collectionId,
        uint256 pubId,
        uint256 profileId,
        uint256 totalAmount
    );
    event CoinOpInitialized(
        uint256 collectionId,
        uint256 profileId,
        uint256 pubId,
        address creatorAddress,
        uint256 numberOfCollections
    );

    constructor(
        string memory _metadataDetails,
        address _hub,
        address _moduleGlobals,
        address _printAccessControlAddress,
        address _printSplitsDataAddress,
        address _printDesignDataAddress,
        address _marketCreatorAddress,
        address _collectionCreatorAddress,
        address _printCommunityDataAddress
    ) HubRestricted(_hub) {
        MODULE_GLOBALS = IModuleRegistry(_moduleGlobals);
        marketCreator = MarketCreator(_marketCreatorAddress);
        collectionCreator = CollectionCreator(_collectionCreatorAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        printCommunityData = PrintCommunityData(_printCommunityDataAddress);
        _metadata = _metadataDetails;
    }

    function initializePublicationAction(
        uint256 _profileId,
        uint256 _pubId,
        address _executor,
        bytes calldata _data
    ) external override onlyHub returns (bytes memory) {
        (
            PrintLibrary.CollectionValuesParams memory _collectionCreator,
            uint256 _printType
        ) = abi.decode(_data, (PrintLibrary.CollectionValuesParams, uint256));

        if (!printAccessControl.isDesigner(_executor)) {
            revert InvalidAddress();
        }

        uint256 _collectionId = _configureCollection(
            _collectionCreator,
            _executor,
            _printType,
            _pubId,
            _profileId
        );

        _collectionGroups[_profileId][_pubId] = _collectionId;

        emit CoinOpInitialized(
            _collectionId,
            _profileId,
            _pubId,
            _executor,
            _collectionCreator.prices.length
        );

        return
            abi.encode(
                _collectionCreator.prices,
                _collectionCreator.acceptedTokens,
                _collectionCreator.uri
            );
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata _params
    ) external override onlyHub returns (bytes memory) {
        (
            uint256[] memory _chosenIndexes,
            uint256[] memory _quantities,
            string memory _encryptedFulfillment,
            address _currency,
            bool _fiat
        ) = abi.decode(
                _params.actionModuleData,
                (uint256[], uint256[], string, address, bool)
            );

        if (
            !MODULE_GLOBALS.isErc20CurrencyRegistered(_currency) ||
            !printSplitsData.getIsCurrency(_currency)
        ) {
            revert CurrencyNotWhitelisted();
        }

        uint256 _collectionId = _collectionGroups[
            _params.publicationActedProfileId
        ][_params.publicationActedId];

        (uint256 _grandTotal, bool _isVerified) = _managePurchase(
            _params,
            _currency,
            _chosenIndexes,
            _quantities,
            _collectionId,
            _fiat
        );

        PrintLibrary.BuyTokensParams memory _buyTokensParams = PrintLibrary
            .BuyTokensParams({
                collectionIds: _fillCollection(
                    _collectionId,
                    _quantities.length
                ),
                collectionAmounts: _quantities,
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

        emit CoinOpPurchased(
            _params.actorProfileOwner,
            _collectionId,
            _params.publicationActedId,
            _params.publicationActedProfileId,
            _grandTotal
        );

        return abi.encode(_collectionId, _currency, _chosenIndexes);
    }

    function _transferTokens(
        uint256 _collectionId,
        uint256 _chosenIndex,
        uint256 _chosenAmount,
        address _chosenCurrency,
        address _designer,
        address _buyer
    ) internal returns (uint256) {
        address _fulfiller = printDesignData.getCollectionFulfiller(
            _collectionId
        );
        uint256 _printType = printDesignData.getCollectionPrintType(
            _collectionId
        );

        uint256 _fulfillerBase = printSplitsData.getFulfillerBase(
            _fulfiller,
            _printType
        );
        uint256 _fulfillerSplit = printSplitsData.getFulfillerSplit(
            _fulfiller,
            _printType
        );

        uint256 _totalPrice = printDesignData.getCollectionPrices(
            _collectionId
        )[_chosenIndex] * _chosenAmount;

        uint256 _calculatedPrice = _calculateAmount(
            _chosenCurrency,
            _totalPrice
        );
        uint256 _calculatedBase = _calculateAmount(
            _chosenCurrency,
            _fulfillerBase * _chosenAmount
        );

        uint256 _fulfillerAmount = _calculatedBase +
            ((_fulfillerSplit * _calculatedPrice) / 1e20);

        if (_fulfillerAmount > 0) {
            IERC20(_chosenCurrency).transferFrom(
                _buyer,
                _fulfiller,
                _fulfillerAmount
            );
        }

        if ((_calculatedPrice - _fulfillerAmount) > 0) {
            IERC20(_chosenCurrency).transferFrom(
                _buyer,
                _designer,
                _calculatedPrice - _fulfillerAmount
            );
        }

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
        address _executor,
        uint256 _printType,
        uint256 _pubId,
        uint256 _profileId
    ) internal returns (uint256) {
        uint256 _collectionId = collectionCreator.createCollection(
            PrintLibrary.MintParams({
                prices: _collectionCreator.prices,
                acceptedTokens: _collectionCreator.acceptedTokens,
                communityIds: _collectionCreator.communityIds,
                uri: _collectionCreator.uri,
                fulfiller: _collectionCreator.fulfiller,
                pubId: _pubId,
                profileId: _profileId,
                dropId: _collectionCreator.dropId,
                creator: _executor,
                printType: _printType,
                origin: 0,
                amount: _collectionCreator.amount,
                unlimited: _collectionCreator.unlimited,
                encrypted: _collectionCreator.encrypted
            })
        );

        return _collectionId;
    }

    function _checkCommunity(
        uint256 _collectionId,
        uint256 _profileId
    ) internal view returns (bool) {
        uint256[] memory _communityIds = printDesignData
            .getCollectionCommunityIds(_collectionId);
        bool _validMember = true;

        if (_communityIds.length > 0) {
            _validMember = false;
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
        uint256 _exchangeRate = printSplitsData.getRateByCurrency(_currency);

        if (_exchangeRate == 0) {
            revert InvalidAmounts();
        }

        uint256 _weiDivisor = printSplitsData.getWeiByCurrency(_currency);
        uint256 _tokenAmount = (_amountInWei * _weiDivisor) / _exchangeRate;

        return _tokenAmount;
    }

    function _checkAndSend(
        address _currency,
        address _buyer,
        uint256[] memory _quantities,
        uint256[] memory _chosenIndexes,
        uint256 _collectionId,
        uint256 _profileId,
        bool _isVerified
    ) internal returns (uint256) {
        uint256 _total = 0;
        for (uint256 i = 0; i < _chosenIndexes.length; i++) {
            if (
                !printDesignData.getIsCollectionTokenAccepted(
                    _collectionId,
                    _currency
                )
            ) {
                revert CurrencyNotWhitelisted();
            }

            if (!_checkCommunity(_collectionId, _profileId)) {
                revert InvalidCommunityMember();
            }

            if (
                printDesignData.getCollectionTokensMinted(_collectionId) +
                    _quantities[i] >
                printDesignData.getCollectionAmount(_collectionId)
            ) {
                revert ExceedAmount();
            }

            if (!_isVerified) {
                _total = _transferTokens(
                    _collectionId,
                    _chosenIndexes[i],
                    _quantities[i],
                    _currency,
                    printDesignData.getCollectionCreator(_collectionId),
                    _buyer
                );
            }
        }

        return _total;
    }

    function _managePurchase(
        Types.ProcessActionParams calldata _params,
        address _currency,
        uint256[] memory _chosenIndexes,
        uint256[] memory _quantities,
        uint256 _collectionId,
        bool _fiat
    ) internal returns (uint256, bool) {
        bool _isVerified = false;

        if (_fiat) {
            _isVerified = printAccessControl.isVerifiedFiat(
                _params.actorProfileOwner,
                _params.publicationActedProfileId,
                _params.publicationActedId
            );
        }

        return (
            _checkAndSend(
                _currency,
                _params.actorProfileOwner,
                _quantities,
                _chosenIndexes,
                _collectionId,
                _params.actorProfileId,
                _isVerified
            ),
            _isVerified
        );
    }

    function _fillCollection(
        uint256 _collectionId,
        uint256 _quantitiesLength
    ) internal pure returns (uint256[] memory) {
        uint256[] memory collectionIds = new uint256[](_quantitiesLength);
        for (uint256 i = 0; i < _quantitiesLength; i++) {
            collectionIds[i] = _collectionId;
        }
        return collectionIds;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external view override returns (bool) {
        return
            interfaceId == bytes4(keccak256(abi.encodePacked("LENS_MODULE"))) ||
            interfaceId == type(IPublicationActionModule).interfaceId;
    }

    function getModuleMetadataURI()
        external
        view
        override
        returns (string memory)
    {
        return _metadata;
    }
}
