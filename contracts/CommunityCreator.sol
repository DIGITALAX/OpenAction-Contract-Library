// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintCommunityData.sol";
import "./PrintOrderData.sol";
import "./PrintDesignData.sol";

contract CommunityCreator {
    PrintAccessControl public printAccessControl;
    PrintCommunityData public printCommunityData;
    PrintDesignData public printDesignData;
    PrintOrderData public printOrderData;
    string public symbol;
    string public name;

    error InvalidAddress();
    error RequirementsNotMet();

    modifier onlyCommunitySteward() {
        if (!printAccessControl.isCommunitySteward(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(
        address _printOrderDataAddress,
        address _printAccessControlAddress,
        address _printDesignDataAddress
    ) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printOrderData = PrintOrderData(_printOrderDataAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);

        symbol = "CCR";
        name = "CollectionCreator";
    }

    function createNewCommunity(
        PrintLibrary.CreateCommunityParams memory _params
    ) public onlyCommunitySteward {
        printCommunityData.createCommunity(_params);
    }

    function updateExistingCommunity(
        PrintLibrary.CreateCommunityParams memory _params,
        uint256 _communityId
    ) public {
        if (
            printCommunityData.getCommunitySteward(_communityId) != msg.sender
        ) {
            revert InvalidAddress();
        }

        printCommunityData.updateCommunity(_params, _communityId);
    }

    function joinCommunity(
        address _memberAddress,
        uint256 _communityId,
        uint256 _memberProfileId
    ) public {
        uint256[] memory _tokenIds = printOrderData.getAddressToTokenIds(
            _memberAddress
        );

        bool _isValid = false;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            address _creator = printDesignData.getCollectionCreator(
                _tokenIds[i]
            );
            PrintLibrary.Origin _origin = printDesignData.getCollectionOrigin(
                _tokenIds[i]
            );
            PrintLibrary.PrintType _print = printDesignData
                .getCollectionPrintType(_tokenIds[i]);

            if (
                printCommunityData.getCommunityIsValidCreator(
                    _creator,
                    _communityId
                ) &&
                printCommunityData.getCommunityIsValidOrigin(
                    _origin,
                    _communityId
                ) &&
                printCommunityData.getCommunityIsValidPrintType(
                    _print,
                    _communityId
                )
            ) {
                _isValid = true;
                break;
            }
        }

        if (!_isValid) {
            revert RequirementsNotMet();
        }

        address[] memory _valid20AddressKeys = printCommunityData
            .getCommunityValid20AddressKeys(_communityId);

        for (uint256 i = 0; i < _valid20AddressKeys.length; i++) {
            if (
                IERC20(_valid20AddressKeys[i]).balanceOf(_memberAddress) <
                printCommunityData.getCommunityValid20Threshold(
                    _valid20AddressKeys[i],
                    _communityId
                )
            ) {
                revert RequirementsNotMet();
            }
        }

        printCommunityData.addCommunityMember(
            _memberAddress,
            _communityId,
            _memberProfileId
        );
    }

    function leaveCommunity(
        uint256 _communityId,
        uint256 _memberProfileId
    ) public {
        if (
            !printCommunityData.getIsCommunityMember(
                _communityId,
                _memberProfileId
            )
        ) {
            revert InvalidAddress();
        }

        printCommunityData.removeCommunityMember(
            _communityId,
            _memberProfileId
        );
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
}
