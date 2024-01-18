// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

contract LegendLibrary {
    struct TransferTokens {
        uint256 printType;
        uint256 collectionId;
        uint256 chosenIndex;
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
        uint256 printType;
        uint256 fulfillerBase;
        uint256 fulfillerSplit;
        uint256 designerSplit;
    }

    struct LevelInfo {
        uint256[] collectionIds;
        uint256[] amounts;
    }

    struct CreateGrant {
        LevelInfo[6] levelInfo;
        address[] granteeAddresses;
        uint256[] splitAmounts;
        uint256[3] amounts;
        uint256[3] submitBys;
        uint256 pubId;
        uint256 profileId;
    }

    struct Milestone {
        MilestoneStatus status;
        uint256 amount;
        uint256 submitBy;
        bool allClaimed;
    }

    struct Grant {
        LevelInfo[6] levelInfo;
        address[] granteeAddresses;
        uint256 grantId;
        uint256 pubId;
        uint256 profileId;
    }

    enum MilestoneStatus {
        NotClaimed,
        Claimed
    }
}
