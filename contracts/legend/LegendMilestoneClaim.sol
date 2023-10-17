// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LegendRegister.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./../PrintAccessControl.sol";
import "./../PrintSplitsData.sol";
import "./LegendRegister.sol";

contract LegendMilestoneClaim {
    using Strings for uint256;
    PrintAccessControl public printAccessControl;
    PrintSplitsData public printSplitsData;
    LegendRegister public legendRegister;

    error GranteeNotRegistered();
    error InvalidClaim();
    error AlreadyClaimed();
    error AddressNotAdmin();

    modifier onlyGrantee(uint256 _pubId) {
        if (legendRegister.getGranteeSplitAmount(msg.sender, _pubId) != 0) {
            revert GranteeNotRegistered();
        }
        _;
    }

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert AddressNotAdmin();
        }
        _;
    }

    event MilestoneClaimed(address claimer, uint256 milestone, uint256 pubId);

    constructor(
        address _legendRegisterAddress,
        address _printAccessControlAddress,
        address _printSplitsDataAddress
    ) {
        legendRegister = LegendRegister(_legendRegisterAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
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
            revert InvalidClaim();
        }

        if (
            legendRegister.getGranteeClaimedMilestone(
                msg.sender,
                _pubId,
                _milestone
            )
        ) {
            revert AlreadyClaimed();
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
                        _amount * _splitAmount
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

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
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
