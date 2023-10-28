// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {IModuleGlobals} from "./../lens/v2/interfaces/IModuleGlobals.sol";
import "./../MarketCreator.sol";
import "./../legend/LegendRegister.sol";
import "./../PrintAccessControl.sol";
import "./../PrintSplitsData.sol";
import "./../PrintDesignData.sol";

library LegendOpenActionLibrary {
    struct TransferTokens {
        PrintLibrary.PrintType printType;
        uint256 collectionId;
        uint256 chosenIndex;
        uint256 designerSplit;
        uint256 fulfillerSplit;
        uint256 fulfillerBase;
        address fulfiller;
        address designer;
        address chosenCurrency;
        address buyer;
    }

    struct SenderInfo {
        address fulfiller;
        address designer;
        PrintLibrary.PrintType print;
        uint256 fBase;
        uint256 fSplit;
        uint256 dSplit;
    }
}

contract LegendOpenAction is HubRestricted, IPublicationActionModule {
    MarketCreator public marketCreator;
    PrintAccessControl public printAccessControl;
    PrintSplitsData public printSplitsData;
    PrintDesignData public printDesignData;
    LegendRegister public legendRegister;
    address public legendMilestone;

    error CurrencyNotWhitelisted();
    error InvalidAddress();
    error InvalidAmounts();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    struct LevelInfo {
        uint256[] collectionIds;
        uint256[] amounts;
    }

    IModuleGlobals public immutable MODULE_GLOBALS;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => LevelInfo))) _grantLevelInfo;
    mapping(uint256 => mapping(uint256 => address)) _granteeReceiver;

    event GrantContributed(
        address granteeAddress,
        uint256 level,
        uint256 pubId,
        uint256 profileId,
        uint256 amount
    );
    event LevelsAdded(uint256 profileId, uint256 pubId, address granteeAddress);

    constructor(
        address _hub,
        address _moduleGlobals,
        address _printAccessControlAddress,
        address _printSplitsDataAddress,
        address _printDesignDataAddress,
        address _marketCreatorAddress,
        address _legendMilestoneAddress,
        address _legendRegisterAddress
    ) HubRestricted(_hub) {
        MODULE_GLOBALS = IModuleGlobals(_moduleGlobals);
        marketCreator = MarketCreator(_marketCreatorAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        legendRegister = LegendRegister(_legendRegisterAddress);
        legendMilestone = _legendMilestoneAddress;
    }

    function initializePublicationAction(
        uint256 _profileId,
        uint256 _pubId,
        address _executor,
        bytes calldata _data
    ) external override onlyHub returns (bytes memory) {
        (
            uint256[][2] memory _level2,
            uint256[][2] memory _level3,
            uint256[][2] memory _level4,
            uint256[][2] memory _level5,
            uint256[][2] memory _level6,
            uint256[][2] memory _level7,
            address _granteeAddress
        ) = abi.decode(
                _data,
                (
                    uint256[][2],
                    uint256[][2],
                    uint256[][2],
                    uint256[][2],
                    uint256[][2],
                    uint256[][2],
                    address
                )
            );

        if (legendRegister.getGrantIdentifier(_granteeAddress) == bytes32(0)) {
            revert InvalidAddress();
        }

        _grantLevelInfo[_profileId][_pubId][2] = LevelInfo({
            collectionIds: _level2[0],
            amounts: _level2[1]
        });
        _grantLevelInfo[_profileId][_pubId][3] = LevelInfo({
            collectionIds: _level3[0],
            amounts: _level3[1]
        });
        _grantLevelInfo[_profileId][_pubId][4] = LevelInfo({
            collectionIds: _level4[0],
            amounts: _level4[1]
        });
        _grantLevelInfo[_profileId][_pubId][5] = LevelInfo({
            collectionIds: _level5[0],
            amounts: _level5[1]
        });
        _grantLevelInfo[_profileId][_pubId][6] = LevelInfo({
            collectionIds: _level6[0],
            amounts: _level6[1]
        });
        _grantLevelInfo[_profileId][_pubId][7] = LevelInfo({
            collectionIds: _level7[0],
            amounts: _level7[1]
        });

        _granteeReceiver[_profileId][_pubId] = _granteeAddress;

        emit LevelsAdded(_profileId, _pubId, _granteeAddress);

        return _data;
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata _params
    ) external override onlyHub returns (bytes memory) {
        (
            uint256[] memory _chosenIndexes,
            address _currency,
            uint256 _level,
            string memory _encryptedFulfillment
        ) = abi.decode(
                _params.actionModuleData,
                (uint256[], address, uint256, string)
            );

        address _granteeReceiverAddress = _granteeReceiver[
            _params.publicationActedProfileId
        ][_params.publicationActedId];

        if (
            !MODULE_GLOBALS.isCurrencyWhitelisted(_currency) ||
            !printSplitsData.getIsCurrency(_currency)
        ) {
            revert CurrencyNotWhitelisted();
        }

        uint256 _grantAmount = 0;

        if (_level != 1) {
            uint256[] memory _collectionIds = _grantLevelInfo[
                _params.publicationActedProfileId
            ][_params.publicationActedId][_level].collectionIds;

            for (uint256 i = 0; i < _collectionIds.length; i++) {
                _grantAmount += _processLevel(
                    _collectionIds[i],
                    _chosenIndexes[i],
                    _currency,
                    _params.actorProfileOwner
                );
            }

            PrintLibrary.BuyTokensParams memory _buyTokensParams = PrintLibrary
                .BuyTokensParams({
                    collectionIds: _grantLevelInfo[
                        _params.publicationActedProfileId
                    ][_params.publicationActedId][_level].collectionIds,
                    collectionAmounts: _grantLevelInfo[
                        _params.publicationActedProfileId
                    ][_params.publicationActedId][_level].amounts,
                    collectionIndexes: _chosenIndexes,
                    details: _encryptedFulfillment,
                    buyerAddress: _params.actorProfileOwner,
                    chosenCurrency: _currency,
                    pubId: _params.publicationActedId,
                    profileId: _params.publicationActedProfileId,
                    buyerProfileId: _params.actorProfileId,
                    pkpAddress: address(0),
                    withPKP: false
                });

            marketCreator.buyTokens(_buyTokensParams);
        } else {
            _grantAmount = printSplitsData.getWeiByCurrency(_currency) * 1;
        }

        IERC20(_currency).transferFrom(
            _params.actorProfileOwner,
            legendMilestone,
            _grantAmount
        );

        legendRegister.setGrantAmountFunded(
            _granteeReceiverAddress,
            _currency,
            _params.publicationActedId,
            _grantAmount
        );

        emit GrantContributed(
            _granteeReceiverAddress,
            _level,
            _params.publicationActedId,
            _params.publicationActedProfileId,
            _grantAmount
        );

        return
            abi.encode(
                _grantLevelInfo[_params.publicationActedProfileId][
                    _params.publicationActedId
                ][_level],
                _currency,
                _chosenIndexes
            );
    }

    function _processLevel(
        uint256 _collectionId,
        uint256 _chosenIndex,
        address _currency,
        address _buyer
    ) internal returns (uint256) {
        LegendOpenActionLibrary.SenderInfo memory _info = _getSenderInfo(
            _collectionId
        );

        return
            _transferTokens(
                LegendOpenActionLibrary.TransferTokens({
                    printType: _info.print,
                    collectionId: _collectionId,
                    chosenIndex: _chosenIndex,
                    designerSplit: _info.dSplit,
                    fulfillerSplit: _info.fSplit,
                    fulfillerBase: _info.fBase,
                    fulfiller: _info.fulfiller,
                    designer: _info.designer,
                    chosenCurrency: _currency,
                    buyer: _buyer
                })
            );
    }

    function _transferTokens(
        LegendOpenActionLibrary.TransferTokens memory _params
    ) internal returns (uint256) {
        uint256 _totalPrice = printDesignData.getCollectionPrices(
            _params.collectionId
        )[_params.chosenIndex];

        IERC20(_params.chosenCurrency).transferFrom(
            _params.buyer,
            _params.fulfiller,
            _calculateAmount(
                _params.chosenCurrency,
                _params.fulfillerBase + (_totalPrice * _params.fulfillerSplit)
            )
        );
        IERC20(_params.chosenCurrency).transferFrom(
            _params.buyer,
            _params.designer,
            _calculateAmount(
                _params.chosenCurrency,
                _totalPrice *
                    printSplitsData.getDesignerSplit(
                        _params.designer,
                        _params.printType
                    )
            )
        );

        return
            _calculateAmount(
                _params.chosenCurrency,
                (_totalPrice -
                    (_totalPrice * _params.fulfillerSplit) -
                    (_totalPrice * _params.designerSplit) -
                    _params.fulfillerBase)
            );
    }

    function _getSenderInfo(
        uint256 _collectionIds
    ) internal view returns (LegendOpenActionLibrary.SenderInfo memory) {
        address _fulfiller = printDesignData.getCollectionFulfiller(
            _collectionIds
        );
        address _designer = printDesignData.getCollectionCreator(
            _collectionIds
        );
        PrintLibrary.PrintType _printType = printDesignData
            .getCollectionPrintType(_collectionIds);
        uint256 _fulfillerBase = printSplitsData.getFulfillerBase(
            _fulfiller,
            _printType
        );
        uint256 _fulfillerSplit = printSplitsData.getFulfillerSplit(
            _fulfiller,
            _printType
        );
        uint256 _designerSplit = printSplitsData.getDesignerSplit(
            _fulfiller,
            _printType
        );

        return (
            LegendOpenActionLibrary.SenderInfo({
                fulfiller: _fulfiller,
                designer: _designer,
                print: _printType,
                fBase: _fulfillerBase,
                fSplit: _fulfillerSplit,
                dSplit: _designerSplit
            })
        );
    }

    function getGrantLevelCollectionIds(
        uint256 _pubId,
        uint256 _profileId,
        uint256 _level
    ) public view returns (uint256[] memory) {
        return _grantLevelInfo[_profileId][_pubId][_level].collectionIds;
    }

    function getGrantLevelAmounts(
        uint256 _pubId,
        uint256 _profileId,
        uint256 _level
    ) public view returns (uint256[] memory) {
        return _grantLevelInfo[_profileId][_pubId][_level].amounts;
    }

    function getGranteeReceiverAddress(
        uint256 _pubId,
        uint256 _profileId
    ) public view returns (address) {
        return _granteeReceiver[_profileId][_pubId];
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

    function setMarketCreatorAddress(
        address _newMarketCreatorAddress
    ) public onlyAdmin {
        marketCreator = MarketCreator(_newMarketCreatorAddress);
    }

    function setLegendRegisterAddress(
        address _newLegendRegisterAddress
    ) public onlyAdmin {
        legendRegister = LegendRegister(_newLegendRegisterAddress);
    }

    function setLegendMilestoneAddress(
        address _newLegendMilestoneAddress
    ) public onlyAdmin {
        legendMilestone = (_newLegendMilestoneAddress);
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
