// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LegendRegister.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LegendAccessControl.sol";
import "./../PrintSplitsData.sol";
import "./LegendRegister.sol";
import "./LegendErrors.sol";

contract LegendMilestone {
    using Strings for uint256;
    LegendAccessControl public legendAccessControl;
    PrintSplitsData public printSplitsData;
    LegendRegister public legendRegister;

    modifier onlyGrantee(uint256 _pubId) {
        if (legendRegister.getGranteeSplitAmount(msg.sender, _pubId) == 0) {
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

    event MilestoneClaimed(address claimer, uint256 milestone, uint256 pubId);

    constructor(
        address _legendRegisterAddress,
        address _legendAccessControlAddress,
        address _printSplitsDataAddress
    ) {
        legendRegister = LegendRegister(_legendRegisterAddress);
        legendAccessControl = LegendAccessControl(_legendAccessControlAddress);
        printSplitsData = PrintSplitsData(_printSplitsDataAddress);
    }

    function initiateMilestoneClaim(
        uint256 _pubId,
        uint256 _milestone
    ) public onlyGrantee(_pubId) {
        uint256 _grantId = legendRegister.getGrantId(msg.sender, _pubId);

        if (
            legendRegister.getMilestoneStatus(_grantId, _milestone) !=
            MilestoneStatus.NotClaimed ||
            block.timestamp >
            legendRegister.getMilestoneSubmitBy(_grantId, _milestone) + 2 weeks
        ) {
            revert LegendErrors.InvalidClaim();
        }
        if (
            legendRegister.getGranteeClaimedMilestone(
                msg.sender,
                _pubId,
                _milestone
            )
        ) {
            revert LegendErrors.AlreadyClaimed();
        } else {
            address[] memory _currencies = printSplitsData.getAllCurrencies();
            uint256 _splitAmount = legendRegister.getGranteeSplitAmount(
                msg.sender,
                _pubId
            );

            for (uint256 i = 0; i < _currencies.length; i++) {
                uint256 _amount = legendRegister.getGrantAmountFundedByCurrency(
                    msg.sender,
                    _currencies[i],
                    _pubId
                );
                if (_amount > 0) {
                    IERC20(_currencies[i]).transferFrom(
                        address(this),
                        msg.sender,
                        (_amount * _splitAmount) / 10000
                    );
                }
            }

            legendRegister.setGranteeClaimedMilestone(
                msg.sender,
                _pubId,
                _milestone
            );
        }

        address[] memory _addresses = legendRegister.getGrantAddresses(
            msg.sender,
            _pubId
        );

        if (!legendRegister.getAllClaimedMilestone(_grantId, _milestone)) {
            uint256 _hasAllClaimed = 0;

            for (uint256 i; i < _addresses.length; i++) {
                if (
                    legendRegister.getGranteeClaimedMilestone(
                        msg.sender,
                        _pubId,
                        _milestone
                    )
                ) {
                    _hasAllClaimed++;
                }
            }

            if (_hasAllClaimed == _addresses.length) {
                legendRegister.setAllClaimedMilestone(_grantId, _milestone);

                legendRegister.updateMilestoneStatus(
                    msg.sender,
                    MilestoneStatus.Claimed,
                    _pubId,
                    _milestone
                );
            }
        }

        emit MilestoneClaimed(msg.sender, _milestone, _pubId);
    }

    function setLegendAccessControlAddress(
        address _newLegendAccessControlAddress
    ) public onlyAdmin {
        legendAccessControl = LegendAccessControl(_newLegendAccessControlAddress);
    }

    function setPrintSplitsDataAddress(
        address _newPrintSplitsDataAddress
    ) public onlyAdmin {
        printSplitsData = PrintSplitsData(_newPrintSplitsDataAddress);
    }

    function setLegendRegisterAddress(
        address _newLegendRegisterAddress
    ) public onlyAdmin {
        legendRegister = LegendRegister(_newLegendRegisterAddress);
    }
}
