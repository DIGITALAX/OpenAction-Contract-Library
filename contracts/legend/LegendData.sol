// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

import "./LegendAccessControl.sol";
import "./LegendErrors.sol";
import "./LegendLibrary.sol";

contract LegendData {
    LegendAccessControl public legendAccessControl;
    address public legendMilestone;
    uint256 private _grantSupply;

    modifier onlyGranteeMilestoneClaim() {
        if (msg.sender != legendMilestone) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }
    modifier onlyOpenAction() {
        if (!legendAccessControl.isOpenAction(msg.sender)) {
            revert LegendErrors.InvalidContract();
        }
        _;
    }
    mapping(uint256 => LegendLibrary.Grant) private _allGrants;
    mapping(uint256 => mapping(uint256 => uint256)) private _lensToGrantId;
    mapping(uint256 => mapping(uint256 => LegendLibrary.Milestone))
        private _grantToMilestone;
    mapping(uint256 => mapping(address => uint256))
        private _amountFundedToCurrency;
    mapping(uint256 => mapping(address => uint256)) private _granteeSplitAmount;
    mapping(uint256 => mapping(address => mapping(uint256 => bool)))
        private _hasClaimedMilestone;

    event GrantCreated(
        uint256 grantId,
        address creator,
        uint256 pubId,
        uint256 profileId
    );
    event MilestoneClaimed(address claimer, uint256 milestone, uint256 grantId);
    event MilestoneStatusUpdated(
        address updater,
        uint256 grantId,
        uint256 milestone,
        LegendLibrary.MilestoneStatus status
    );

    modifier onlyAdmin() {
        if (!legendAccessControl.isAdmin(msg.sender)) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }

    constructor(address _legendAccessControlAddress) {
        legendAccessControl = LegendAccessControl(_legendAccessControlAddress);
    }

    function registerGrant(
        LegendLibrary.CreateGrant memory _params
    ) external onlyOpenAction {
        if (_params.granteeAddresses.length != _params.splitAmounts.length) {
            revert LegendErrors.InvalidLengths();
        }
        _grantSupply++;

        LegendLibrary.Grant storage newGrant = _allGrants[_grantSupply];

        newGrant.grantId = _grantSupply;
        newGrant.pubId = _params.pubId;
        newGrant.profileId = _params.profileId;
        newGrant.granteeAddresses = _params.granteeAddresses;

        _setLevels(newGrant, _params.levelInfo);

        _lensToGrantId[_params.profileId][_params.pubId] = _grantSupply;

        for (uint256 j = 0; j < 3; j++) {
            _grantToMilestone[_grantSupply][j] = LegendLibrary.Milestone({
                status: LegendLibrary.MilestoneStatus.NotClaimed,
                amount: _params.amounts[j],
                submitBy: _params.submitBys[j],
                allClaimed: false
            });
        }

        for (uint256 i = 0; i < _params.granteeAddresses.length; i++) {
            _granteeSplitAmount[_grantSupply][
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
        LegendLibrary.MilestoneStatus _status,
        uint256 _grantId,
        uint256 _milestone
    ) external onlyGranteeMilestoneClaim {
        _grantToMilestone[_grantId][_milestone - 1].status = _status;

        emit MilestoneStatusUpdated(
            _granteeAddress,
            _grantId,
            _milestone,
            _status
        );
    }

    function setGrantAmountFunded(
        address _currency,
        uint256 _grantId,
        uint256 _amountFunded
    ) external onlyOpenAction {
        _amountFundedToCurrency[_grantId][_currency] = _amountFunded;
    }

    function setGranteeClaimedMilestone(
        address _granteeAddress,
        uint256 _grantId,
        uint256 _milestone
    ) external onlyGranteeMilestoneClaim {
        _hasClaimedMilestone[_grantId][_granteeAddress][_milestone - 1] = true;

        emit MilestoneClaimed(_granteeAddress, _milestone, _grantId);
    }

    function setMilestoneClaimAddress(
        address _legendMilestoneAddress
    ) public onlyAdmin {
        legendMilestone = _legendMilestoneAddress;
    }

    function _setLevels(
        LegendLibrary.Grant memory _newGrant,
        LegendLibrary.LevelInfo[6] memory _levels
    ) private pure {
        for (uint256 i = 0; i < _levels.length; i++) {
            _newGrant.levelInfo[i].collectionIds = _levels[i].collectionIds;
            _newGrant.levelInfo[i].amounts = _levels[i].amounts;
            _newGrant.levelInfo[i].level = _levels[i].level;
        }
    }

    function setLegendAccessControlAddress(
        address _newLegendAccessControlAddress
    ) public onlyAdmin {
        legendAccessControl = LegendAccessControl(
            _newLegendAccessControlAddress
        );
    }

    function setAllClaimedMilestone(
        uint256 _grantId,
        uint256 _milestone
    ) external onlyGranteeMilestoneClaim {
        _grantToMilestone[_grantId][_milestone - 1].allClaimed = true;
    }

    function getGrantSupply() public view returns (uint256) {
        return _grantSupply;
    }

    function getGrantAddresses(
        uint256 _grantId
    ) public view returns (address[] memory) {
        return _allGrants[_grantId].granteeAddresses;
    }

    function getGrantId(
        uint256 _profileId,
        uint256 _pubId
    ) public view returns (uint256) {
        return _lensToGrantId[_profileId][_pubId];
    }

    function getGrantPubId(uint256 _grantId) public view returns (uint256) {
        return _allGrants[_grantId].pubId;
    }

    function getGrantProfileId(uint256 _grantId) public view returns (uint256) {
        return _allGrants[_grantId].profileId;
    }

    function getGrantLevelCollectionIds(
        uint256 _grantId,
        uint256 _level
    ) public view returns (uint256[] memory) {
        return _allGrants[_grantId].levelInfo[_level - 2].collectionIds;
    }

    function getGrantLevelAmounts(
        uint256 _grantId,
        uint256 _level
    ) public view returns (uint256[] memory) {
        return _allGrants[_grantId].levelInfo[_level - 2].amounts;
    }

    function getMilestoneStatus(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (LegendLibrary.MilestoneStatus) {
        return _grantToMilestone[_grantId][_milestone - 1].status;
    }

    function getMilestoneSubmitBy(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (uint256) {
        return _grantToMilestone[_grantId][_milestone - 1].submitBy;
    }

    function getMilestoneAmount(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (uint256) {
        return _grantToMilestone[_grantId][_milestone - 1].amount;
    }

    function getGrantAmountFundedByCurrency(
        address _currency,
        uint256 _grantId
    ) public view returns (uint256) {
        return _amountFundedToCurrency[_grantId][_currency];
    }

    function getGranteeClaimedMilestone(
        address _granteeAddress,
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (bool) {
        return _hasClaimedMilestone[_grantId][_granteeAddress][_milestone - 1];
    }

    function getAllClaimedMilestone(
        uint256 _grantId,
        uint256 _milestone
    ) public view returns (bool) {
        return _grantToMilestone[_grantId][_milestone - 1].allClaimed;
    }

    function getGranteeSplitAmount(
        address _granteeAddress,
        uint256 _grantId
    ) public view returns (uint256) {
        return _granteeSplitAmount[_grantId][_granteeAddress];
    }
}
