// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

contract PrintLibrary {
    enum Origin {
        CoinOp,
        Chromadin,
        Legend,
        Listener,
        Other
    }

    enum PrintType {
        Sticker,
        Poster,
        Shirt,
        Hoodie,
        NFTOnly
    }
    enum OrderStatus {
        Fulfilled,
        Shipped,
        Shipping,
        Designing
    }

    struct Collection {
        uint256[] prices;
        uint256[] tokenIds;
        string uri;
        address fulfiller;
        address creator;
        uint256 collectionId;
        uint256 pubId;
        uint256 profileId;
        uint256 mintedTokens;
        uint256 amount;
        Origin origin;
        PrintType printType;
        bool unlimited;
    }
    struct Token {
        string uri;
        address chosenCurrency;
        uint256 tokenId;
        uint256 collectionId;
        uint256 index;
    }
    struct Order {
        uint256[] subOrderIds;
        string[] messages;
        string details;
        address buyer;
        address chosenCurrency;
        uint256 orderId;
        uint256 pubId;
        uint256 profileId;
        uint256 buyerProfileId;
        uint256 timestamp;
        uint256 totalPrice;
    }
    struct NFTOnlyOrder {
        string[] messages;
        address buyer;
        address chosenCurrency;
        uint256 orderId;
        uint256 pubId;
        uint256 profileId;
        uint256 buyerProfileId;
        uint256 timestamp;
        uint256 totalPrice;
    }

    struct SubOrder {
        uint256[] tokenIds;
        address fulfiller;
        uint256 subOrderId;
        uint256 orderId;
        uint256 amount;
        uint256 price;
        PrintLibrary.OrderStatus status;
        bool isFulfilled;
    }
    struct MintParams {
        uint256[] prices;
        string uri;
        address fulfiller;
        address creator;
        PrintLibrary.PrintType printType;
        Origin origin;
        uint256 amount;
        uint256 pubId;
        uint256 profileId;
        bool unlimited;
    }
    struct BuyTokensParams {
        uint256[] collectionIds;
        uint256[] collectionAmounts;
        uint256[] collectionIndexes;
        string details;
        address buyerAddress;
        address chosenCurrency;
        uint256 pubId;
        uint256 profileId;
        uint256 buyerProfileId;
    }
    struct BuyTokensOnlyNFTParams {
        uint256[] collectionIds;
        uint256[] collectionAmounts;
        address buyerAddress;
        address chosenCurrency;
        uint256 pubId;
        uint256 profileId;
        uint256 buyerProfileId;
    }
}
