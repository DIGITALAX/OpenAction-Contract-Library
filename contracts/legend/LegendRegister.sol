// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./../PrintAccessControl.sol";

enum MilestoneStatus {
    NotClaimed,
    Claimed
}

library LegendRegisterLibrary {
    struct CreateGrant {
        address[] granteeAddresses;
        uint256[] splitAmounts;
        uint256[3] amounts;
        uint256[3] submitBy;
        uint256 pubId;
        uint256 profileId;
    }
}

contract LegendRegister {
    PrintAccessControl public printAccessControl;
    address public legendOpenAction;
    address public legendMilestone;
    uint256 private _grantSupply;

    struct Milestone {
        MilestoneStatus status;
        uint256 amount;
        uint256 submitBy;
        bool allClaimed;
    }

    struct Grant {
        address[] granteeAddresses;
        uint256 grantId;
        uint256 pubId;
        uint256 profileId;
    }

    error InvalidMilestoneUpdate();
    error InvalidLengths();
    error InvalidAddress();

    modifier onlyGranteeMilestoneClaim() {
        if (msg.sender != legendMilestone) {
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyOpenAction() {
        if (msg.sender != legendOpenAction) {
            revert InvalidAddress();
        }
        _;
    }
    mapping(address => bytes32) private _addressToIdentifier;
    mapping(bytes32 => mapping(uint256 => Grant)) private _identifierToGrant;
    mapping(uint256 => mapping(uint256 => Milestone)) private _grantToMilestone;
    mapping(bytes32 => mapping(uint256 => mapping(address => uint256)))
        private _amountFundedToCurrency;
    mapping(bytes32 => mapping(uint256 => mapping(address => uint256)))
        private _granteeSplitAmount;
    mapping(bytes32 => mapping(uint256 => mapping(address => mapping(uint256 => bool))))
        private _hasClaimedMilestone;

    event GrantCreated(
        uint256 grantId,
        address creator,
        uint256 pubId,
        uint256 profileId
    );

    event MilestoneStatusUpdated(
        address updater,
        uint256 pubId,
        uint256 milestoneStatus
    );
    event MilestoneClaimUpdated(
        address granteeAddress,
        uint256 pubId,
        uint256 milestoneId,
        MilestoneStatus status
    );
    event MilestoneIdentifierUpdated(
        address granteeAddress,
        uint256 pubId,
        bytes32 milestoneIdentifier
    );

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
    }

    function registerGrant(
        LegendRegisterLibrary.CreateGrant memory _params
    ) public {
        if (_params.granteeAddresses.length != _params.splitAmounts.length) {
            revert InvalidLengths();
        }
        bytes32 _grantIdentifier = keccak256(
            abi.encodePacked(_params.granteeAddresses, _params.pubId)
        );
        for (uint256 i = 0; i < _params.granteeAddresses.length; i++) {
            _addressToIdentifier[
                _params.granteeAddresses[i]
            ] = _grantIdentifier;
        }
        _identifierToGrant[_grantIdentifier][_params.pubId] = Grant({
            grantId: _grantSupply++,
            granteeAddresses: _params.granteeAddresses,
            pubId: _params.pubId,
            profileId: _params.profileId
        });

        for (uint256 j = 0; j < 3; j++) {
            _grantToMilestone[_grantSupply][j + 1] = Milestone({
                status: MilestoneStatus.NotClaimed,
                amount: _params.amounts[j],
                submitBy: _params.submitBy[j],
                allClaimed: false
            });
        }

        for (uint256 i = 0; i < _params.granteeAddresses.length; i++) {
            _granteeSplitAmount[_grantIdentifier][_params.pubId][
                _params.granteeAddresses[i]
            ] = _params.splitAmounts[i];
        }

        emit GrantCreated(
            _grantSupply,
            msg.sender,
            _params.pubId,
            _params.profileId
        );
    }

    function updateMilestoneStatus(
        address _granteeAddress,
        MilestoneStatus _status,
        uint256 _pubId,
        uint256 _milestoneId
    ) external onlyGranteeMilestoneClaim {
        _grantToMilestone[
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .grantId
        ][_milestoneId].status = _status;

        emit MilestoneClaimUpdated(
            _granteeAddress,
            _pubId,
            _milestoneId,
            _status
        );
    }

    function setGrantAmountFunded(
        address _granteeAddress,
        address _currency,
        uint256 _pubId,
        uint256 _amountFunded
    ) external onlyOpenAction {
        _amountFundedToCurrency[_addressToIdentifier[_granteeAddress]][_pubId][
            _currency
        ] = _amountFunded;
    }

    function setGranteeClaimedMilestone(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestone
    ) external onlyGranteeMilestoneClaim {
        _hasClaimedMilestone[_addressToIdentifier[_granteeAddress]][_pubId][
            _granteeAddress
        ][_milestone] = true;
    }

    function setGrantAddresses(
        address _legendMilestoneAddress,
        address _grantOpenActionAddress
    ) public onlyAdmin {
        legendMilestone = _legendMilestoneAddress;
        legendOpenAction = _grantOpenActionAddress;
    }

    function setAllClaimedMilestone(
        uint256 _grantId,
        uint256 _milestone
    ) external onlyGranteeMilestoneClaim {
        _grantToMilestone[_grantId][_milestone].allClaimed = true;
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function getGrantSupply() public view returns (uint256) {
        return _grantSupply;
    }

    function getGrantAddresses(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (address[] memory) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .granteeAddresses;
    }

    function getGrantId(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _identifierToGrant[_addressToIdentifier[_granteeAddress]][_pubId]
                .grantId;
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
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (MilestoneStatus) {
        return _grantToMilestone[_grantId][_milestone].status;
    }

    function getMilestoneSubmitBy(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (uint256) {
        return _grantToMilestone[_grantId][_milestone].submitBy;
    }

    function getMilestoneAmount(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (uint256) {
        return _grantToMilestone[_grantId][_milestone].amount;
    }

    function getGrantAmountFundedByCurrency(
        address _granteeAddress,
        address _currency,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _amountFundedToCurrency[_addressToIdentifier[_granteeAddress]][
                _pubId
            ][_currency];
    }

    function getGrantIdentifier(
        address _granteeAddress
    ) public view returns (bytes32) {
        return _addressToIdentifier[_granteeAddress];
    }

    function getGranteeClaimedMilestone(
        address _granteeAddress,
        uint256 _pubId,
        uint256 _milestone
    ) public view returns (bool) {
        return
            _hasClaimedMilestone[_addressToIdentifier[_granteeAddress]][_pubId][
                _granteeAddress
            ][_milestone];
    }

    function getAllClaimedMilestone(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (bool) {
        return _grantToMilestone[_grantId][_milestone].allClaimed;
    }

    function getGranteeSplitAmount(
        address _granteeAddress,
        uint256 _pubId
    ) public view returns (uint256) {
        return
            _granteeSplitAmount[_addressToIdentifier[_granteeAddress]][_pubId][
                _granteeAddress
            ];
    }
}
