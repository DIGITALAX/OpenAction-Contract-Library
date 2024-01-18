library LegendOpenActionLibrary {
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
}
