// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import {HubRestricted} from "./../lens/v2/base/HubRestricted.sol";
import {Types} from "./../lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./../lens/v2/interfaces/IPublicationActionModule.sol";
import {ILensModule} from "./../lens/v2/interfaces/ILensModule.sol";
import {IModuleRegistry} from "./../lens/v2/interfaces/IModuleRegistry.sol";
import "./../MarketCreator.sol";
import "./../PrintSplitsData.sol";
import "./../PrintDesignData.sol";
import "./../legend/LegendData.sol";
import "./../legend/LegendAccessControl.sol";
import "./../legend/LegendLibrary.sol";

contract LegendOpenAction is
    HubRestricted,
    ILensModule,
    IPublicationActionModule
{
    MarketCreator public marketCreator;
    LegendAccessControl public legendAccessControl;
    PrintSplitsData public printSplitsData;
    PrintDesignData public printDesignData;
    LegendData public legendData;
    address public legendMilestone;
    string private _metadata;

    modifier onlyAdmin() {
        if (!legendAccessControl.isAdmin(msg.sender)) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }

    IModuleRegistry public immutable MODULE_GLOBALS;

    mapping(uint256 => mapping(uint256 => mapping(uint256 => LegendLibrary.LevelInfo))) _grantGroups;
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
        string memory _metadataDetails,
        address _hub,
        address _moduleGlobals,
        address _legendAccessControlAddress,
        address _printSplitsDataAddress,
        address _printDesignDataAddress,
        address _marketCreatorAddress,
        address _legendMilestoneAddress,
        address _legendDataAddress
    ) HubRestricted(_hub) {
        MODULE_GLOBALS = IModuleRegistry(_moduleGlobals);
        marketCreator = MarketCreator(_marketCreatorAddress);
        legendAccessControl = LegendAccessControl(_legendAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        legendData = LegendData(_legendDataAddress);
        legendMilestone = _legendMilestoneAddress;
        _metadata = _metadataDetails;
    }

    function initializePublicationAction(
        uint256 _profileId,
        uint256 _pubId,
        address _executor,
        bytes calldata _data
    ) external override onlyHub returns (bytes memory) {
        if (legendAccessControl.isGrantee(_executor)) {
            revert LegendErrors.InvalidAddress();
        }
        (
            LegendLibrary.LevelInfo[6] memory _levelInfo,
            address[] memory _granteeAddresses,
            uint256[] memory _splitAmounts,
            uint256[3] memory _amounts,
            uint256[3] memory _submitBys
        ) = abi.decode(
                _data,
                (
                    LegendLibrary.LevelInfo[6],
                    address[],
                    uint256[],
                    uint256[3],
                    uint256[3]
                )
            );

        _grantGroups[_profileId][_pubId][0] = _levelInfo[0];
        _grantGroups[_profileId][_pubId][1] = _levelInfo[1];
        _grantGroups[_profileId][_pubId][2] = _levelInfo[2];
        _grantGroups[_profileId][_pubId][3] = _levelInfo[3];
        _grantGroups[_profileId][_pubId][4] = _levelInfo[4];
        _grantGroups[_profileId][_pubId][5] = _levelInfo[5];

        legendData.registerGrant(
            LegendLibrary.CreateGrant({
                levelInfo: _levelInfo,
                granteeAddresses: _granteeAddresses,
                splitAmounts: _splitAmounts,
                amounts: _amounts,
                submitBys: _submitBys,
                pubId: _pubId,
                profileId: _profileId
            })
        );

        _granteeReceiver[_profileId][_pubId] = _executor;

        emit LevelsAdded(_profileId, _pubId, _executor);

        return abi.encode(_profileId, _pubId, _executor);
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
        uint256 _grantId = legendData.getGrantId(
            _params.publicationActedProfileId,
            _params.publicationActedId
        );

        if (
            !MODULE_GLOBALS.isErc20CurrencyRegistered(_currency) ||
            !printSplitsData.getIsCurrency(_currency)
        ) {
            revert LegendErrors.CurrencyNotWhitelisted();
        }

        uint256 _grantAmount = 0;

        if (_level != 1) {
            uint256[] memory _collectionIds = _grantGroups[
                _params.publicationActedProfileId
            ][_params.publicationActedId][_level - 2].collectionIds;

            for (uint256 i = 0; i < _collectionIds.length; i++) {
                if (
                    !printDesignData.getIsCollectionTokenAccepted(
                        _collectionIds[i],
                        _currency
                    )
                ) {
                    revert LegendErrors.CurrencyNotWhitelisted();
                }

                _grantAmount += _processLevel(
                    _collectionIds[i],
                    _chosenIndexes[i],
                    _currency,
                    _params.actorProfileOwner
                );
            }

            PrintLibrary.BuyTokensParams memory _buyTokensParams = PrintLibrary
                .BuyTokensParams({
                    collectionIds: _grantGroups[
                        _params.publicationActedProfileId
                    ][_params.publicationActedId][_level - 2].collectionIds,
                    collectionAmounts: _grantGroups[
                        _params.publicationActedProfileId
                    ][_params.publicationActedId][_level - 2].amounts,
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

        legendData.setGrantAmountFunded(_currency, _grantId, _grantAmount);

        emit GrantContributed(
            _granteeReceiverAddress,
            _level,
            _params.publicationActedId,
            _params.publicationActedProfileId,
            _grantAmount
        );

        return
            abi.encode(
                _grantGroups[_params.publicationActedProfileId][
                    _params.publicationActedId
                ][_level - 2],
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
        LegendLibrary.SenderInfo memory _info = _getSenderInfo(_collectionId);

        return
            _transferTokens(
                LegendLibrary.TransferTokens({
                    printType: _info.printType,
                    collectionId: _collectionId,
                    chosenIndex: _chosenIndex,
                    designerSplit: _info.designerSplit,
                    fulfillerSplit: _info.fulfillerSplit,
                    fulfillerBase: _info.fulfillerBase,
                    fulfiller: _info.fulfiller,
                    designer: _info.designer,
                    chosenCurrency: _currency,
                    buyer: _buyer
                })
            );
    }

    function _transferTokens(
        LegendLibrary.TransferTokens memory _params
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
        uint256 _collectionId
    ) internal view returns (LegendLibrary.SenderInfo memory) {
        address _fulfiller = printDesignData.getCollectionFulfiller(
            _collectionId
        );
        address _designer = printDesignData.getCollectionCreator(_collectionId);
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
        uint256 _designerSplit = printSplitsData.getDesignerSplit(
            _fulfiller,
            _printType
        );

        return (
            LegendLibrary.SenderInfo({
                fulfiller: _fulfiller,
                designer: _designer,
                printType: _printType,
                fulfillerBase: _fulfillerBase,
                fulfillerSplit: _fulfillerSplit,
                designerSplit: _designerSplit
            })
        );
    }

    function setPrintSplitsDataAddress(
        address _newPrintSplitsDataAddress
    ) public onlyAdmin {
        printSplitsData = PrintSplitsData(_newPrintSplitsDataAddress);
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printDesignData = PrintDesignData(_newPrintDesignDataAddress);
    }

    function setLegendAccessControlAddress(
        address _newLegendAccessControlAddress
    ) public onlyAdmin {
        legendAccessControl = LegendAccessControl(
            _newLegendAccessControlAddress
        );
    }

    function setMarketCreatorAddress(
        address _newMarketCreatorAddress
    ) public onlyAdmin {
        marketCreator = MarketCreator(_newMarketCreatorAddress);
    }

    function setLegendDataAddress(
        address _newLegendDataAddress
    ) public onlyAdmin {
        legendData = LegendData(_newLegendDataAddress);
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
            revert LegendErrors.InvalidAmounts();
        }
        uint256 _exchangeRate = printSplitsData.getRateByCurrency(_currency);

        uint256 _weiDivisor = printSplitsData.getWeiByCurrency(_currency);
        uint256 _tokenAmount = (_amountInWei / _exchangeRate) * _weiDivisor;

        return _tokenAmount;
    }

    function getGranteeReceiverAddress(
        uint256 _pubId,
        uint256 _profileId
    ) public view returns (address) {
        return _granteeReceiver[_profileId][_pubId];
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
