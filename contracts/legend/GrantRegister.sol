// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./PrintAccessControl.sol";

library GrantRegisterLibrary {
    struct CreateGrant {
        address[] granteeAddresses;
        uint256[] splitAmounts;
        uint256[3] amounts;
        uint256 pubId;
        uint256 profileId;
    }
}

contract GrantRegister {
    using SafeMath for uint256;
    PrintAccessControl public printAccessControl;
    address grantOpenAction;
    address grantMilestoneClaim;

    struct Grant {
        address[] granteeAddresses;
        bytes32[3] milestoneIdentifier;
        uint256[] splitAmounts;
        uint256[3] amounts;
        uint256 amountFunded;
        uint256 milestoneStatus;
        uint256 pubId;
        uint256 profileId;
    }

    error onlyGranteeMilestoneClaimAddress();
    error invalidMilestoneUpdate();
    error invalidLengths();
    error invalidLensMetrics();
    error onlyGrantOpenActionAddress();
    error addressNotAdmin();

    modifier onlyGranteeMilestoneClaim() {
        if (msg.sender != grantMilestoneClaim) {
            revert onlyGranteeMilestoneClaimAddress();
        }
        _;
    }

    modifier onlyOpenAction() {
        if (msg.sender != grantOpenAction) {
            revert onlyGrantOpenActionAddress();
        }
        _;
    }

    mapping(address => bytes32) private _addressToIdentifier;
    mapping(bytes32 => mapping(uint256 => Grant)) private _identifierToGrant;
    mapping(bytes32 => mapping(uint256 => mapping(address => mapping(uint256 => uint256))))
        private _granteeToMilestoneAmount;
    mapping(bytes32 => mapping(uint256 => mapping(address => mapping(uint256 => bool))))
        private _hasClaimedMilestone;

    event GrantCreated(address creator, uint256 pubId, uint256 profileId);
    event MilestoneStatusUpdated(
        address updater,
        uint256 pubId,
        uint256 milestoneStatus
    );
    event MilestoneClaimUpdated(
        address granteeAddress,
        uint256 pubId,
        uint256 milestoneId
    );
    event MilestoneIdentifierUpdated(
        address granteeAddress,
        uint256 pubId,
        bytes32 milestoneIdentifier
    );

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert addressNotAdmin();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
    }

    function registerGrant(
        GrantRegisterLibrary.CreateGrant memory _createGrantParams
    ) public {
        if (
            _createGrantParams.granteeAddresses.length !=
            _createGrantParams.splitAmounts.length
        ) {
            revert invalidLengths();
        }

        bytes32 _grantIdentifier = keccak256(
            abi.encodePacked(
                _createGrantParams.granteeAddresses,
                _createGrantParams.pubId
            )
        );

        for (
            uint256 i = 0;
            i < _createGrantParams.granteeAddresses.length;
            i++
        ) {
            _addressToIdentifier[
                _createGrantParams.granteeAddresses[i]
            ] = _grantIdentifier;
        }

        _identifierToGrant[_grantIdentifier][_createGrantParams.pubId] = Grant({
            granteeAddresses: _createGrantParams.granteeAddresses,
            milestoneIdentifier: [bytes32(0), bytes32(0), bytes32(0)],
            splitAmounts: _createGrantParams.splitAmounts,
            amountFunded: 0,
            amounts: _createGrantParams.amounts,
            milestoneStatus: 0,
            pubId: _createGrantParams.pubId,
            profileId: _createGrantParams.profileId
        });

        for (
            uint256 i = 0;
            i < _createGrantParams.granteeAddresses.length;
            i++
        ) {
            for (uint256 j = 0; j < 3; j++) {
                uint256 amount = _createGrantParams.amounts[j];
                uint256 percentage = _createGrantParams.splitAmounts[i];
                uint256 granteeAmount = amount.mul(percentage).div(100);

                _granteeToMilestoneAmount[_grantIdentifier][
                    _createGrantParams.pubId
                ][_createGrantParams.granteeAddresses[i]][j] = granteeAmount;
            }
        }

        emit GrantCreated(
            msg.sender,
            _createGrantParams.pubId,
            _createGrantParams.profileId
        );
    }

    function updateMilestoneIdentifier(
        address _granteeAddress,
        bytes32 _milestoneIdentifier,
        uint256 _pubId
    ) public onlyGranteeMilestoneClaim {
        uint256 _currentMilestone = _identifierToGrant[
            _addressToIdentifier[_granteeAddress]
        ][_pubId].milestoneStatus;
        if (_currentMilestone <= 2) {
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneIdentifier[_currentMilestone] = _milestoneIdentifier;
        } else {
            revert invalidMilestoneUpdate();
        }

        emit MilestoneIdentifierUpdated(
            _granteeAddress,
            _pubId,
            _milestoneIdentifier
        );
    }

    function updateClaimedMilestone(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestoneId
    ) public onlyGranteeMilestoneClaim {
        _hasClaimedMilestone[_addressToIdentifier[_granteeAddress]][_pubId][
            _granteeAddress
        ][_milestoneId] = true;

        emit MilestoneClaimUpdated(_granteeAddress, _pubId, _milestoneId);
    }

    function updateMilestone(
        address _granteeAddress,
        uint256 _pubId
    ) public onlyGranteeMilestoneClaim {
        if (
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneStatus <= 2
        ) {
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneStatus =
                _identifierToGrant[_addressToIdentifier[_granteeAddress]][
                    _pubId
                ].milestoneStatus +
                1;
        } else {
            revert invalidMilestoneUpdate();
        }

        emit MilestoneStatusUpdated(
            _granteeAddress,
            _pubId,
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneStatus
        );
    }

    function setGrantAmountFunded(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _amountFunded
    ) public onlyOpenAction {
        _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
            .amountFunded += _amountFunded;
    }

    function getGrantProfileId(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .profileId;
    }

    function getMilestoneStatus(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneStatus;
    }

    function getMilestoneIdentifier(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestoneId
    ) public view returns (bytes32) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .milestoneIdentifier[_milestoneId];
    }

    function getMilestoneAmount(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256[3] memory) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .amounts;
    }

    function getGrantAmountFunded(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .amountFunded;
    }

    function getGrantIdentifier(
        address _granteeAddress
    ) public view returns (bytes32) {
        return _addressToIdentifier[_granteeAddress];
    }

    function getGranteeClaimedMilestone(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestoneId
    ) public view returns (bool) {
        return
            _hasClaimedMilestone[_addressToIdentifier[_granteeAddress]][_pubId][
                _granteeAddress
            ][_milestoneId];
    }

    function getGranteeMilestoneAmount(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestoneId
    ) public view returns (uint256) {
        return
            _granteeToMilestoneAmount[_addressToIdentifier[_granteeAddress]][
                _pubId
            ][_granteeAddress][_milestoneId];
    }

    function setGrantAddresses(
        address _grantMilestoneClaimAddress,
        address _grantOpenActionAddress
    ) public onlyAdmin {
        grantMilestoneClaim = _grantMilestoneClaimAddress;
        grantOpenAction = _grantOpenActionAddress;
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }
}
