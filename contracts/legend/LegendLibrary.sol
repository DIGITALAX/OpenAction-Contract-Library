// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

contract LegendLibrary {
    struct TransferTokens {
        uint256 collectionId;
        uint256 chosenIndex;
        uint256 chosenAmount;
        uint256 designerSplit;
        uint256 fulfillerSplit;
        uint256 fulfillerBase;
        address fulfiller;
        address designer;
        address chosenCurrency;
        address buyer;
    }

    struct SenderInfo {
        address fulfiller;
        address designer;
        uint256 fulfillerBase;
        uint256 fulfillerSplit;
        uint256 designerSplit;
    }

    struct LevelInfo {
        uint256[] collectionIds;
        uint256[] amounts;
        uint8 level;
    }

    struct CreateGrant {
        LevelInfo[6] levelInfo;
        uint256[][3] goalToCurrency;
        address[] acceptedCurrencies;
        address[] granteeAddresses;
        uint256[] splitAmounts;
        uint256[3] submitBys;
        string uri;
        uint256 pubId;
        uint256 profileId;
    }

    struct Milestone {
        mapping(address => uint256) currencyToGoal;
        mapping(address => uint256) splitAmounts;
        mapping(address => bool) hasClaimedMilestone;
        uint256 submitBy;
        MilestoneStatus status;
        bool allClaimed;
    }

    struct Grant {
        LevelInfo[6] levelInfo;
        Milestone[3] milestones;
        mapping(address => bool) currencyAccepted;
        mapping(address => uint256) splitAmounts;
        mapping(address => uint256) amountFundedToCurrency;
        address[] acceptedCurrencies;
        address[] granteeAddresses;
        string uri;
        uint256 grantId;
        uint256 pubId;
        uint256 profileId;
    }

    struct RegisterProps {
        LevelInfo[6] levelInfo;
        uint256[][3] goalToCurrency;
        address[] acceptedCurrencies;
        address[] granteeAddresses;
        uint256[] splitAmounts;
        uint256[3] submitBys;
        string uri;
    }

    enum MilestoneStatus {
        NotClaimed,
        Claimed
    }
}
