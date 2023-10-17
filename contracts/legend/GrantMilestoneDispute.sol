// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";

contract GrantMilestoneDispute {
    PrintAccessControl public printAccessControl;

    error invalidAddress();

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert invalidAddress();
        }
        _;
    }


    constructor(
        address _printAccessControlAddress
    ) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
    }

}


