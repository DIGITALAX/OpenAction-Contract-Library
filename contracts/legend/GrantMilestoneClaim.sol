// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GrantRegister.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GrantMilestoneClaim {
    using Strings for uint256;

    GrantRegister public grantRegister;
    IERC20 public currency;
    address[] public milestones;
    bytes32 public defaultIdentifier;

    error notRegisteredGrantee();
    error alreadyClaimedMilestone();
    error invalidMilestone();
    error milestoneInitiated();
    error timeNotExpired();
    error invalidResolution();

    modifier onlyGrantee(uint256 _pubId) {
        if (grantRegister.getGrantProfileId(msg.sender, _pubId) == 0) {
            revert notRegisteredGrantee();
        }
        _;
    }

    event MilestoneClaimed(address claimer, uint256 amount, uint256 milestone);

    constructor(
        address _currencyAddress,
        address _grantRegisterAddress,
        address _ooV3Address
    ) {
        currency = IERC20(_currencyAddress);
        grantRegister = GrantRegister(_grantRegisterAddress);
        oov3 = OptimisticOracleV3Interface(_ooV3Address);
        defaultIdentifier = oov3.defaultIdentifier();
    }

    function setDisputeManager(
        address _disputeManagerAddress
    ) public onlyOwner {
        grantDisputeManager = GrantDisputeManager(_disputeManagerAddress);
    }

    function initiateMilestoneClaim(uint256 _pubId) public onlyGrantee(_pubId) {
        uint256 _milestoneToClaim = grantRegister.getMilestoneStatus(
            msg.sender,
            _pubId
        ) + 1;
        if (_milestoneToClaim > 3) {
            revert invalidMilestone();
        } else if (
            grantRegister.getMilestoneIdentifier(
                msg.sender,
                _pubId,
                _milestoneToClaim - 1
            ) != bytes32(0)
        ) {
            revert milestoneInitiated();
        }

        uint256 _bondAmount = grantRegister.getMilestoneAmount(
            msg.sender,
            _pubId
        )[_milestoneToClaim];
        uint256 _profileId = grantRegister.getGrantProfileId(
            msg.sender,
            _pubId
        );

        currency.approve(address(oov3), _bondAmount);

        string memory _assertionString = string(
            abi.encodePacked(
                "Milestone ",
                _milestoneToClaim.toString(),
                " completed for Publication Id ",
                _profileId.toString(),
                "-",
                _pubId.toString()
            )
        );

        bytes memory _assertionBytes = bytes(_assertionString);

        bytes32 _assertionId = oov3.assertTruth(
            _assertionBytes,
            address(this),
            address(0),
            address(grantDisputeManager),
            5 * 24 * 60 * 60,
            currency,
            _bondAmount,
            defaultIdentifier,
            bytes32(0)
        );

        grantDisputeManager.setIds(_assertionId, _profileId, _pubId);

        grantRegister.updateMilestoneIdentifier(
            msg.sender,
            _assertionId,
            _pubId
        );
    }

    function claimVerifiedMilestone(uint256 _pubId) public onlyGrantee(_pubId) {
        uint256 _milestone = grantRegister.getMilestoneStatus(
            msg.sender,
            _pubId
        );

        if (
            grantRegister.getGranteeClaimedMilestone(
                msg.sender,
                _pubId,
                _milestone
            )
        ) {
            revert alreadyClaimedMilestone();
        }

        bytes32 _assertionId = grantRegister.getMilestoneIdentifier(
            msg.sender,
            _pubId,
            _milestone
        );

        uint64 _expirationTime = oov3.getAssertion(_assertionId).expirationTime;

        bool _settled = oov3.getAssertion(_assertionId).settled;

        bool _settlementResolution = oov3
            .getAssertion(_assertionId)
            .settlementResolution;

        if (block.timestamp > _expirationTime) {
            if (!_settled) {
                _settlementResolution = oov3.settleAndGetAssertionResult(
                    _assertionId
                );
            }

            if (!_settlementResolution) {
                revert invalidResolution();
            }
        } else {
            revert timeNotExpired();
        }

        uint256 _amount = grantRegister.getGranteeMilestoneAmount(
            msg.sender,
            _pubId,
            _milestone
        );

        grantRegister.updateClaimedMilestone(msg.sender, _pubId, _milestone);
        currency.transfer(msg.sender, _amount);

        emit MilestoneClaimed(msg.sender, _amount, _milestone);
    }

    function settleAndGetAssertionResult(
        bytes32 _assertionId
    ) public returns (bool) {
        return oov3.settleAndGetAssertionResult(_assertionId);
    }

    function getAssertionResult(
        bytes32 _assertionId
    ) public view returns (bool) {
        return oov3.getAssertionResult(_assertionId);
    }

    function getAssertion(
        bytes32 _assertionId
    ) public view returns (OptimisticOracleV3Interface.Assertion memory) {
        return oov3.getAssertion(_assertionId);
    }
}
