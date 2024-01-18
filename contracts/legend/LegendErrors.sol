// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

contract LegendErrors {
    error GranteeNotRegistered();
    error InvalidClaim();
    error AlreadyClaimed();
    error AddressNotAdmin();
    error InvalidMilestoneUpdate();
    error InvalidLengths();
    error InvalidAddress();
    error InvalidContract();
    error CurrencyNotWhitelisted();
    error InvalidAmounts();
    error Existing();
    error CantRemoveSelf();
}
