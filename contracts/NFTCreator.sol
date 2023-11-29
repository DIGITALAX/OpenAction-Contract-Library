// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./PrintDesignData.sol";
import "./CollectionCreator.sol";
import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";

contract NFTCreator is ERC721Enumerable {
    CollectionCreator public collectionCreator;
    PrintDesignData public printData;
    PrintAccessControl public printAccessControl;

    error OnlyCollectionCreator();
    error AddressNotAdmin();

    event BatchTokenMinted(address indexed to, uint256[] tokenIds);

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert AddressNotAdmin();
        }
        _;
    }

    constructor(
        address _printDataAddress,
        address _printAccessControlAddress
    ) ERC721("NFTCreator", "NFTC") {
        printData = PrintDesignData(_printDataAddress);
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
    }

    function mintBatch(
        string memory _uri,
        address _purchaserAddress,
        address _chosenCurrency,
        uint256 _amount,
        uint256 _collectionId,
        uint256 _chosenIndex
    ) public {
        if (msg.sender != address(collectionCreator)) {
            revert OnlyCollectionCreator();
        }
        uint256[] memory tokenIds = new uint256[](_amount);
        uint256 _supply = printData.getTokenSupply();
        for (uint256 i = 0; i < _amount; i++) {
            PrintLibrary.Token memory newToken = PrintLibrary.Token({
                uri: _uri,
                chosenCurrency: _chosenCurrency,
                tokenId: _supply + i + 1,
                collectionId: _collectionId,
                index: _chosenIndex
            });
            _safeMint(_purchaserAddress, _supply + i + 1);
            printData.setNFT(newToken);
            tokenIds[i] = _supply + i + 1;
        }

        emit BatchTokenMinted(_purchaserAddress, tokenIds);
    }

    function burnBatch(uint256[] memory _tokenIds) public {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(
                msg.sender == ownerOf(_tokenIds[i]),
                "ERC721Metadata: Only token owner can burn tokens"
            );
        }

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            burn(_tokenIds[i]);
        }
    }

    function burn(uint256 _tokenId) public {
        require(
            msg.sender == ownerOf(_tokenId),
            "ERC721Metadata: Only token owner can burn token"
        );
        _burn(_tokenId);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        return printData.getTokenURI(_tokenId);
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printData = PrintDesignData(_newPrintDesignDataAddress);
    }

    function setCollectionCreatorAddress(
        address _newCollectionCreatorAddress
    ) public onlyAdmin {
        collectionCreator = CollectionCreator(_newCollectionCreatorAddress);
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }
}
