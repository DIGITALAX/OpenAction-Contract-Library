// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PrintCommunityData {
    PrintAccessControl public printAccessControl;
    string public symbol;
    string public name;
    address public communityCreator;
    uint256 private _communitySupply;

    using SafeMath for uint256;

    mapping(uint256 => PrintLibrary.Community) private _communities;
    mapping(uint256 => mapping(uint256 => uint256))
        public _memberProfileIdToIndex;
    mapping(uint256 => mapping(uint256 => bool)) private _profileIdToCommunity;
    mapping(address => mapping(uint256 => bool)) private _addressToCommunity;

    event CommunityCreated(
        uint256 indexed communityId,
        address steward,
        string uri
    );
    event CommunityUpdated(
        uint256 indexed communityId,
        address steward,
        string uri
    );
    event CommunityMemberAdded(
        uint256 indexed communityId,
        address memberAddress,
        uint256 memberProfileId
    );
    event CommunityMemberRemoved(
        uint256 indexed communityId,
        uint256 memberProfileId
    );

    error InvalidAddress();

    modifier onlyCommunityCreator() {
        if (msg.sender != communityCreator) {
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(
        address _printAccessControlAddress,
        address _communityCreatorAddress
    ) {
        symbol = "PCD";
        name = "PrintCommunityData";
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        communityCreator = _communityCreatorAddress;
    }

    function createCommunity(
        PrintLibrary.CreateCommunityParams memory _params
    ) external {
        _communitySupply++;

        _communities[_communitySupply].communityId = _communitySupply;
        _communities[_communitySupply].uri = _params.uri;
        _communities[_communitySupply].steward = _params.steward;

        for (uint256 i = 0; i < _params.validCreators.length; i++) {
            _communities[_communitySupply].validCreators[
                _params.validCreators[i]
            ] = true;

            _communities[_communitySupply].validCreatorKeys.push(
                _params.validCreators[i]
            );
        }

        for (uint256 i = 0; i < _params.validOrigins.length; i++) {
            _communities[_communitySupply].validOrigins[
                _params.validOrigins[i]
            ] = true;

            _communities[_communitySupply].validOriginKeys.push(
                _params.validOrigins[i]
            );
        }

        for (uint256 i = 0; i < _params.validPrintTypes.length; i++) {
            _communities[_communitySupply].validPrintTypes[
                _params.validPrintTypes[i]
            ] = true;

            _communities[_communitySupply].validPrintTypeKeys.push(
                _params.validPrintTypes[i]
            );
        }

        for (uint256 i = 0; i < _params.valid20Addresses.length; i++) {
            _communities[_communitySupply].valid20Thresholds[
                _params.valid20Addresses[i]
            ] = _params.valid20Thresholds[i];
            _communities[_communitySupply].valid20AddressKeys.push(
                _params.valid20Addresses[i]
            );
        }

        emit CommunityCreated(_communitySupply, _params.steward, _params.uri);
    }

    function updateCommunity(
        PrintLibrary.CreateCommunityParams memory _params,
        uint256 communityId
    ) external onlyCommunityCreator {
        PrintLibrary.Community storage _community = _communities[communityId];

        _community.uri = _params.uri;
        _community.steward = _params.steward;

        // Purge old key-value pairs
        for (uint256 i = 0; i < _community.validCreatorKeys.length; i++) {
            delete _community.validCreators[_community.validCreatorKeys[i]];
        }
        for (uint256 i = 0; i < _community.validOriginKeys.length; i++) {
            delete _community.validOrigins[_community.validOriginKeys[i]];
        }
        for (uint256 i = 0; i < _community.validPrintTypeKeys.length; i++) {
            delete _community.validPrintTypes[_community.validPrintTypeKeys[i]];
        }

        for (uint256 i = 0; i < _community.valid20AddressKeys.length; i++) {
            delete _community.valid20Thresholds[
                _community.valid20AddressKeys[i]
            ];
        }

        delete _community.validCreatorKeys;
        delete _community.validOriginKeys;
        delete _community.validPrintTypeKeys;
        delete _community.valid20AddressKeys;

        for (uint256 i = 0; i < _params.validCreators.length; i++) {
            _community.validCreators[_params.validCreators[i]] = true;

            _community.validCreatorKeys.push(_params.validCreators[i]);
        }

        for (uint256 i = 0; i < _params.validOrigins.length; i++) {
            _community.validOrigins[_params.validOrigins[i]] = true;

            _community.validOriginKeys.push(_params.validOrigins[i]);
        }

        for (uint256 i = 0; i < _params.validPrintTypes.length; i++) {
            _community.validPrintTypes[_params.validPrintTypes[i]] = true;

            _community.validPrintTypeKeys.push(_params.validPrintTypes[i]);
        }

        for (uint256 i = 0; i < _params.valid20Addresses.length; i++) {
            _community.valid20Thresholds[_params.valid20Addresses[i]] = _params
                .valid20Thresholds[i];
            _community.valid20AddressKeys.push(_params.valid20Addresses[i]);
        }

        emit CommunityUpdated(communityId, _params.steward, _params.uri);
    }

    function addCommunityMember(
        address _memberAddress,
        uint256 _communityId,
        uint256 _memberProfileId
    ) external onlyCommunityCreator {
        PrintLibrary.CommunityMember memory newMember = PrintLibrary
            .CommunityMember({
                memberAddress: _memberAddress,
                memberProfileId: _memberProfileId
            });
        _communities[_communityId].communityMembers.push(newMember);
        _profileIdToCommunity[_memberProfileId][_communityId] = true;
        _addressToCommunity[_memberAddress][_communityId] = true;
        _memberProfileIdToIndex[_memberProfileId][_communityId] =
            _communities[_communityId].communityMembers.length -
            1;

        emit CommunityMemberAdded(
            _communityId,
            _memberAddress,
            _memberProfileId
        );
    }

    function removeCommunityMember(
        address _memberAddress,
        uint256 _communityId,
        uint256 _memberProfileId
    ) external onlyCommunityCreator {
        PrintLibrary.Community storage _community = _communities[_communityId];

        uint256 _index = _memberProfileIdToIndex[_memberProfileId][
            _communityId
        ];
        uint256 _lastIndex = _community.communityMembers.length.sub(1);

        PrintLibrary.CommunityMember memory _lastMember = _community
            .communityMembers[_lastIndex];

        _community.communityMembers[_index].memberAddress = _lastMember
            .memberAddress;
        _community.communityMembers[_index].memberProfileId = _lastMember
            .memberProfileId;

        _memberProfileIdToIndex[_lastMember.memberProfileId][
            _communityId
        ] = _index;
        _community.communityMembers.pop();

        delete _memberProfileIdToIndex[_memberProfileId][_communityId];

        _profileIdToCommunity[_memberProfileId][_communityId] = false;
        _addressToCommunity[_memberAddress][_communityId] = false;

        emit CommunityMemberRemoved(_communityId, _memberProfileId);
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function setCommunityCreatorAddress(
        address _newCommunityCreatorAddress
    ) public onlyAdmin {
        communityCreator = _newCommunityCreatorAddress;
    }

    function getCommunitySupply() public view returns (uint256) {
        return _communitySupply;
    }

    function getCommunitySteward(
        uint256 _communityId
    ) public view returns (address) {
        return _communities[_communityId].steward;
    }

    function getCommunityURI(
        uint256 _communityId
    ) public view returns (string memory) {
        return _communities[_communityId].uri;
    }

    function getCommunityMembers(
        uint256 _communityId
    ) public view returns (PrintLibrary.CommunityMember[] memory) {
        return _communities[_communityId].communityMembers;
    }

    function getCommunityValidOriginKeys(
        uint256 _communityId
    ) public view returns (PrintLibrary.Origin[] memory) {
        return _communities[_communityId].validOriginKeys;
    }

    function getCommunityValidCreatorKeys(
        uint256 _communityId
    ) public view returns (address[] memory) {
        return _communities[_communityId].validCreatorKeys;
    }

    function getCommunityValidPrintTypeKeys(
        uint256 _communityId
    ) public view returns (PrintLibrary.PrintType[] memory) {
        return _communities[_communityId].validPrintTypeKeys;
    }

    function getCommunityValid20AddressKeys(
        uint256 _communityId
    ) public view returns (address[] memory) {
        return _communities[_communityId].valid20AddressKeys;
    }

    function getCommunityIsValidCreator(
        address _creator,
        uint256 _communityId
    ) public view returns (bool) {
        return _communities[_communityId].validCreators[_creator];
    }

    function getCommunityIsValidOrigin(
        PrintLibrary.Origin _origin,
        uint256 _communityId
    ) public view returns (bool) {
        return _communities[_communityId].validOrigins[_origin];
    }

    function getCommunityIsValidPrintType(
        PrintLibrary.PrintType _printType,
        uint256 _communityId
    ) public view returns (bool) {
        return _communities[_communityId].validPrintTypes[_printType];
    }

    function getCommunityValid20Threshold(
        address _tokenAddress,
        uint256 _communityId
    ) public view returns (uint256) {
        return _communities[_communityId].valid20Thresholds[_tokenAddress];
    }

    function getIsValidCommunityAddress(
        address _memberAddress,
        uint256 _communityId
    ) public view returns (bool) {
        return _addressToCommunity[_memberAddress][_communityId];
    }

    function getIsCommunityMember(
        uint256 _communityId,
        uint256 _memberProfileId
    ) public view returns (bool) {
        return _profileIdToCommunity[_memberProfileId][_communityId];
    }

    function getMemberToIndex(
        uint256 _communityId,
        uint256 _memberProfileId
    ) public view returns (uint256) {
        return _memberProfileIdToIndex[_memberProfileId][_communityId];
    }
}
