// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LegendData.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LegendAccessControl.sol";
import "./LegendData.sol";
import "./LegendErrors.sol";
import "./LegendMachineCreditSwap.sol";

contract LegendMilestoneEscrow {
    using Strings for uint256;
    LegendAccessControl public legendAccessControl;
    LegendData public legendData;
    LegendMachineCreditSwap public machineCreditSwap;
    string public symbol;
    string public name;
    address public legendOpenAction;

    modifier onlyGrantee(uint256 _grantId) {
        if (legendData.getGranteeSplitAmount(msg.sender, _grantId) == 0) {
            revert LegendErrors.GranteeNotRegistered();
        }
        _;
    }

    modifier onlyOpenAction() {
        if (msg.sender != legendOpenAction) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }

    modifier onlyAdmin() {
        if (!legendAccessControl.isAdmin(msg.sender)) {
            revert LegendErrors.AddressNotAdmin();
        }
        _;
    }

    constructor(
        address _legendDataAddress,
        address _legendAccessControlAddress,
        address _machineCreditSwapAddress
    ) {
        legendData = LegendData(_legendDataAddress);
        legendAccessControl = LegendAccessControl(_legendAccessControlAddress);
        machineCreditSwap = LegendMachineCreditSwap(_machineCreditSwapAddress);
        symbol = "LME";
        name = "LegendMilestoneEscrow";
    }

    function fundGrant(
        address _currency,
        uint256 _amount,
        uint256 _grantId
    ) external onlyOpenAction {
        IERC20(_currency).transferFrom(
            legendOpenAction,
            address(this),
            _amount
        );

        uint256 _idleAmount = 0;

        if (
            block.timestamp >
            legendData.getMilestoneSubmitBy(_grantId, 3) +
                legendData.getPeriodClaim()
        ) {
            _idleAmount = _amount;
        }

        if (_idleAmount == 0) {
            uint256 _totalFunded = legendData.getGrantAmountFundedByCurrency(
                _currency,
                _grantId
            ) + _amount;

            uint256 _goal = 0;
            for (uint8 i = 0; i < 3; i++) {
                _goal += legendData.getMilestoneGoalToCurrency(
                    _currency,
                    _grantId,
                    i + 1
                );
            }

            if (_totalFunded > _goal) {
                _idleAmount += _totalFunded - _goal;
            }
            if (_idleAmount > 0) {
                IERC20(_currency).approve(
                    address(machineCreditSwap),
                    _idleAmount
                );

                machineCreditSwap.receiveAndSwapCredits(_currency, _idleAmount);
            }
        }
    }

    function initiateMilestoneClaim(
        uint256 _grantId,
        uint8 _milestone
    ) public onlyGrantee(_grantId) {
        if (
            legendData.getMilestoneStatus(_grantId, _milestone) !=
            LegendLibrary.MilestoneStatus.NotClaimed ||
            block.timestamp >
            legendData.getMilestoneSubmitBy(_grantId, _milestone) +
                legendData.getPeriodClaim() ||
            block.timestamp <
            legendData.getMilestoneSubmitBy(_grantId, _milestone) -
                legendData.getPeriodClaim()
        ) {
            revert LegendErrors.InvalidClaim();
        }
        if (
            legendData.getGranteeClaimedMilestone(
                msg.sender,
                _grantId,
                _milestone
            )
        ) {
            revert LegendErrors.AlreadyClaimed();
        } else {
            address[] memory _currencies = legendData
                .getGrantAcceptedCurrencies(_grantId);
            uint256 _splitAmount = legendData.getGranteeSplitAmount(
                msg.sender,
                _grantId
            );

            for (uint8 i = 0; i < _currencies.length; i++) {
                uint256 _totalFunded = legendData
                    .getGrantAmountFundedByCurrency(_currencies[i], _grantId);
                uint256 _milestoneAmount = legendData
                    .getMilestoneGoalToCurrency(
                        _currencies[i],
                        _grantId,
                        _milestone
                    );

                if (_totalFunded >= _milestoneAmount) {
                    if (_milestoneAmount > 0) {
                        IERC20(_currencies[i]).transfer(
                            msg.sender,
                            (_milestoneAmount * _splitAmount) / 1e20
                        );
                    }
                }
            }

            legendData.setGranteeClaimedMilestone(
                msg.sender,
                _grantId,
                _milestone
            );
        }

        address[] memory _addresses = legendData.getGrantAddresses(_grantId);

        if (!legendData.getAllClaimedMilestone(_grantId, _milestone)) {
            uint256 _hasAllClaimed = 0;

            for (uint256 i; i < _addresses.length; i++) {
                if (
                    legendData.getGranteeClaimedMilestone(
                        _addresses[i],
                        _grantId,
                        _milestone
                    )
                ) {
                    _hasAllClaimed++;
                }
            }

            if (_hasAllClaimed == _addresses.length) {
                legendData.setAllClaimedMilestone(_grantId, _milestone);

                legendData.updateMilestoneStatus(
                    msg.sender,
                    LegendLibrary.MilestoneStatus.Claimed,
                    _grantId,
                    _milestone
                );
            }
        }
    }

    function grantRecallCheck(uint256 _grantId) public onlyAdmin {
        address[] memory _allCurrencies = legendData.getGrantAcceptedCurrencies(
            _grantId
        );

        for (uint256 i = 0; i < _allCurrencies.length; i++) {
            uint256 _totalFunded = legendData.getGrantAmountFundedByCurrency(
                _allCurrencies[i],
                _grantId
            );

            uint256 _goal = 0;
            for (uint8 j = 0; j < 3; j++) {
                _goal += legendData.getMilestoneGoalToCurrency(
                    _allCurrencies[i],
                    _grantId,
                    j + 1
                );
            }

            if (
                _totalFunded < _goal &&
                block.timestamp >
                legendData.getMilestoneSubmitBy(_grantId, 1) +
                    legendData.getPeriodClaim()
            ) {
                IERC20(_allCurrencies[i]).approve(
                    address(machineCreditSwap),
                    _totalFunded
                );

                machineCreditSwap.receiveAndSwapCredits(
                    _allCurrencies[i],
                    _totalFunded
                );
            }
        }
    }

    function setLegendAccessControlAddress(
        address _newLegendAccessControlAddress
    ) public onlyAdmin {
        legendAccessControl = LegendAccessControl(
            _newLegendAccessControlAddress
        );
    }

    function setLegendDataAddress(
        address _newLegendDataAddress
    ) public onlyAdmin {
        legendData = LegendData(_newLegendDataAddress);
    }

    function setMachineCreditSwapAddress(
        address _newMachineCreditSwapAddress
    ) public onlyAdmin {
        machineCreditSwap = LegendMachineCreditSwap(
            _newMachineCreditSwapAddress
        );
    }

    function setLegendOpenActionAddress(
        address _newLegendOpenActionAddress
    ) public onlyAdmin {
        legendOpenAction = (_newLegendOpenActionAddress);
    }
}
