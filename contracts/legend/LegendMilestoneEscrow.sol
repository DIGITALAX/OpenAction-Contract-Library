// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LegendData.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LegendAccessControl.sol";
import "./../PrintSplitsData.sol";
import "./LegendData.sol";
import "./LegendErrors.sol";

contract LegendMilestoneEscrow {
    using Strings for uint256;
    LegendAccessControl public legendAccessControl;
    PrintSplitsData public printSplitsData;
    LegendData public legendData;

    modifier onlyGrantee(uint256 _grantId) {
        if (legendData.getGranteeSplitAmount(msg.sender, _grantId) == 0) {
            revert LegendErrors.GranteeNotRegistered();
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
        address _printSplitsDataAddress
    ) {
        legendData = LegendData(_legendDataAddress);
        legendAccessControl = LegendAccessControl(_legendAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
    }

    function initiateMilestoneClaim(
        uint256 _grantId,
        uint256 _milestone
    ) public onlyGrantee(_grantId) {
        if (
            legendData.getMilestoneStatus(_grantId, _milestone) !=
            LegendLibrary.MilestoneStatus.NotClaimed ||
            block.timestamp >
            legendData.getMilestoneSubmitBy(_grantId, _milestone) + 2 weeks
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
            address[] memory _currencies = printSplitsData.getAllCurrencies();
            uint256 _splitAmount = legendData.getGranteeSplitAmount(
                msg.sender,
                _grantId
            );

            for (uint256 i = 0; i < _currencies.length; i++) {
                uint256 _amount = legendData.getGrantAmountFundedByCurrency(
                    _currencies[i],
                    _grantId
                );
                if (_amount > 0) {
                    IERC20(_currencies[i]).transferFrom(
                        address(this),
                        msg.sender,
                        (_amount * _splitAmount) / 10000
                    );
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
                        msg.sender,
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

    function setLegendAccessControlAddress(
        address _newLegendAccessControlAddress
    ) public onlyAdmin {
        legendAccessControl = LegendAccessControl(
            _newLegendAccessControlAddress
        );
    }

    function setPrintSplitsDataAddress(
        address _newPrintSplitsDataAddress
    ) public onlyAdmin {
        printSplitsData = PrintSplitsData(_newPrintSplitsDataAddress);
    }

    function setLegendDataAddress(
        address _newLegendDataAddress
    ) public onlyAdmin {
        legendData = LegendData(_newLegendDataAddress);
    }
}
