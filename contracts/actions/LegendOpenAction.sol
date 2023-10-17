// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import {HubRestricted} from "./lens/v2/base/HubRestricted.sol";
import {Types} from "./lens/v2/libraries/constants/Types.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPublicationActionModule} from "./lens/v2/interfaces/IPublicationActionModule.sol";
import {IModuleGlobals} from "./lens/v2/interfaces/IModuleGlobals.sol";
import "./CollectionCreator.sol";
import "./GrantRegister.sol";

// handle all the erc20 transfers in here!!

contract LegendOpenAction is HubRestricted, IPublicationActionModule {
    GrantCollection public grantCollection;
    GrantRegister public grantRegister;
    address public grantMilestoneClaim;

    uint256 BPS_MAX = 10000;

    error CurrencyNotWhitelisted();

    struct LevelInfo {
        uint256[] collectionIds;
        uint256[] amounts;
        uint256[] indexes;
        uint256 totalPrice;
    }

    IModuleGlobals public immutable MODULE_GLOBALS;

    mapping(address => mapping(uint256 => mapping(uint256 => bool))) _verifiedDisputer;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => LevelInfo))) _grantLevelInfo;
    mapping(uint256 => mapping(uint256 => address)) _granteeReceiver;

    constructor(
        address hub,
        address moduleGlobals,
        address grantCollectionAddress,
        address grantMilestoneClaimAddress,
        address grantRegisterAddress,
        address fulfiller,
        address designer,
        uint256 gp,
        uint256 dp,
        uint256 fp
    ) HubRestricted(hub) {
        MODULE_GLOBALS = IModuleGlobals(moduleGlobals);
        grantCollection = GrantCollection(grantCollectionAddress);
        grantMilestoneClaim = grantMilestoneClaimAddress;
        grantRegister = GrantRegister(grantRegisterAddress);
        fulfillerAddress = fulfiller;
        designerAddress = designer;
        grantPercent = gp;
        designerPercent = dp;
        fulfillerPercent = fp;
     
    }

    function initializePublicationAction(
        uint256 profileId,
        uint256 pubId,
        address granteeReceiver /* transactionExecutor */,
        bytes calldata data
    ) external override onlyHub returns (bytes memory) {
        LevelInfo[6] memory _levelInfo = abi.decode(data, (LevelInfo[6]));

        _grantLevelInfo[profileId][pubId][0] = _levelInfo[0];
        _grantLevelInfo[profileId][pubId][1] = _levelInfo[1];
        _grantLevelInfo[profileId][pubId][2] = _levelInfo[2];
        _grantLevelInfo[profileId][pubId][3] = _levelInfo[3];
        _grantLevelInfo[profileId][pubId][4] = _levelInfo[4];
        _grantLevelInfo[profileId][pubId][5] = _levelInfo[5];

        _granteeReceiver[profileId][pubId] = granteeReceiver;

        return data;
    }

    function processPublicationAction(
        Types.ProcessActionParams calldata params
    ) external override onlyHub returns (bytes memory) {
        (
            address currency,
            uint256 level,
            string memory encryptedFulfillment
        ) = abi.decode(params.actionModuleData, (address, uint256, string));
        uint256 _totalAmount = 0;

        address _granteeReceiverAddress = _granteeReceiver[
            params.publicationActedProfileId
        ][params.publicationActedId];

        if (!MODULE_GLOBALS.isCurrencyWhitelisted(currency)) {
            revert CurrencyNotWhitelisted();
        }

        if (level == 1) {
            IERC20(currency).transferFrom(
                params.transactionExecutor,
                grantMilestoneClaim,
                1
            );
            _totalAmount = 1;
        } else {
            _verifiedDisputer[params.transactionExecutor][
                params.publicationActedProfileId
            ][params.publicationActedId] = true;

            _totalAmount = _grantLevelInfo[params.publicationActedProfileId][
                params.publicationActedId
            ][level - 2].totalPrice;

            IERC20(currency).transferFrom(
                params.transactionExecutor,
                grantMilestoneClaim,
                _totalAmount * grantPercent
            );
            IERC20(currency).transferFrom(
                params.transactionExecutor,
                fulfillerAddress,
                _totalAmount * fulfillerPercent
            );
            IERC20(currency).transferFrom(
                params.transactionExecutor,
                designerAddress,
                _totalAmount * designerPercent
            );

            grantRegister.setGrantAmountFunded(
                _granteeReceiverAddress,
                params.publicationActedId,
                _totalAmount * grantPercent
            );

            grantCollection.purchaseAndMintToken(
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].collectionIds,
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].amounts,
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].indexes,
                params.transactionExecutor,
                currency
            );

            _orderSupply++;

            _addressToOrder[params.transactionExecutor][
                params.publicationActedProfileId
            ][params.publicationActedId] = Order({
                orderId: _orderSupply,
                grantPubId: params.publicationActedId,
                grantProfileId: params.publicationActedProfileId,
                level: level,
                details: encryptedFulfillment,
                buyer: params.transactionExecutor,
                chosenAddress: currency
            });

            emit OrderCreated(
                _orderSupply,
                _totalAmount,
                level,
                currency,
                params.publicationActedId,
                params.publicationActedProfileId,
                params.transactionExecutor
            );
        }

        return
            abi.encode(
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].collectionIds,
                currency,
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].amounts,
                _grantLevelInfo[params.publicationActedProfileId][
                    params.publicationActedId
                ][level].indexes
            );
    }

    function getVerifiedMilestoneDisputer(
        address _disputerAddress,
        uint256 _profileId,
        uint256 _pubId
    ) public view returns (bool) {
        return _verifiedDisputer[_disputerAddress][_profileId][_pubId];
    }

    function getGrantLevelInfo(
        uint256 _pubId,
        uint256 _profileId,
        uint256 _level
    ) public view returns (LevelInfo memory) {
        return _grantLevelInfo[_profileId][_pubId][_level - 2];
    }

    function getGranteeReceiver(
        uint256 _pubId,
        uint256 _profileId
    ) public view returns (address) {
        return _granteeReceiver[_profileId][_pubId];
    }
}
