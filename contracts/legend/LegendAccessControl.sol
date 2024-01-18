// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./LegendErrors.sol";

contract LegendAccessControl {
    string public symbol;
    string public name;
    address public fiatPKPAddress;

    mapping(address => bool) private _admins;
    mapping(address => bool) private _grantees;
    mapping(address => bool) private _openActions;
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) _verifiedFiat;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event GranteeAdded(address indexed grantee);
    event GranteeRemoved(address indexed grantee);
    event OpenActionAdded(address indexed openAction);
    event OpenActionRemoved(address indexed openAction);
    event VerifiedFiatAdded(address indexed verified);
    event VerifiedFiatRemoved(address indexed verified);

    modifier onlyAdmin() {
        if (!_admins[msg.sender]) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }

    modifier pkpOrAdmin() {
        if (!_admins[msg.sender] && msg.sender != fiatPKPAddress) {
            revert LegendErrors.InvalidAddress();
        }
        _;
    }

    constructor() {
        _admins[msg.sender] = true;
        symbol = "LAC";
        name = "LegendAccessControl";
    }

    function addAdmin(address _admin) external onlyAdmin {
        if (_admins[_admin] || _admin == msg.sender) {
            revert LegendErrors.Existing();
        }
        _admins[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) external onlyAdmin {
        if (_admin == msg.sender) {
            revert LegendErrors.CantRemoveSelf();
        }
        if (!_admins[_admin]) {
            revert LegendErrors.InvalidAddress();
        }
        _admins[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function addGrantee(address _grantee) external pkpOrAdmin {
        if (_grantees[_grantee]) {
            revert LegendErrors.Existing();
        }
        _grantees[_grantee] = true;
        emit GranteeAdded(_grantee);
    }

    function removeGrantee(address _grantee) external pkpOrAdmin {
        if (!_grantees[_grantee]) {
            revert LegendErrors.InvalidAddress();
        }
        _grantees[_grantee] = false;
        emit GranteeRemoved(_grantee);
    }

    function addOpenAction(address _openAction) external pkpOrAdmin {
        if (_openActions[_openAction]) {
            revert LegendErrors.Existing();
        }
        _openActions[_openAction] = true;
        emit OpenActionAdded(_openAction);
    }

    function removeOpenAction(address _openAction) external pkpOrAdmin {
        if (!_openActions[_openAction]) {
            revert LegendErrors.InvalidAddress();
        }
        _openActions[_openAction] = false;
        emit OpenActionRemoved(_openAction);
    }

    function addVerifiedFiat(
        address _verified,
        uint256 _pubId,
        uint256 _profileId
    ) external pkpOrAdmin {
        if (_verifiedFiat[_verified][_profileId][_pubId]) {
            revert LegendErrors.Existing();
        }
        _verifiedFiat[_verified][_profileId][_pubId] = true;
        emit VerifiedFiatAdded(_verified);
    }

    function removeVerifiedFiat(
        address _verified,
        uint256 _pubId,
        uint256 _profileId
    ) external pkpOrAdmin {
        if (!_verifiedFiat[_verified][_profileId][_pubId]) {
            revert LegendErrors.InvalidAddress();
        }
        _verifiedFiat[_verified][_profileId][_pubId] = false;
        emit VerifiedFiatRemoved(_verified);
    }

    function setFiatPKPAddress(address _newFiatPKPAddress) public onlyAdmin {
        fiatPKPAddress = _newFiatPKPAddress;
    }

    function isAdmin(address _address) public view returns (bool) {
        return _admins[_address];
    }

    function isOpenAction(address _address) public view returns (bool) {
        return _openActions[_address];
    }

    function isGrantee(address _address) public view returns (bool) {
        return _grantees[_address];
    }

    function isVerifiedFiat(
        address _address,
        uint256 _profileId,
        uint256 _pubId
    ) public view returns (bool) {
        return _verifiedFiat[_address][_profileId][_pubId];
    }
}
