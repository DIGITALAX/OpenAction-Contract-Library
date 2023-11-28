// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";
import "./MarketCreator.sol";
import "./PrintDesignData.sol";

contract PrintOrderData {
    PrintAccessControl public printAccessControl;
    MarketCreator public marketCreator;
    PrintDesignData public printDesignData;
    string public symbol;
    string public name;
    uint256 private _orderSupply;
    uint256 private _nftOnlyOrderSupply;
    uint256 private _subOrderSupply;
    mapping(uint256 => PrintLibrary.NFTOnlyOrder) private _nftOnlyOrders;
    mapping(uint256 => PrintLibrary.Order) private _orders;
    mapping(uint256 => PrintLibrary.SubOrder) private _subOrders;
    mapping(address => uint256[]) private _addressToOrderIds;
    mapping(address => uint256[]) private _addressToNFTOnlyOrderIds;
    mapping(address => uint256[]) private _communityHelperAddressToTokenIds;

    error InvalidAddress();
    error InvalidFulfiller();

    event UpdateSubOrderStatus(
        uint256 indexed subOrderId,
        PrintLibrary.OrderStatus newSubOrderStatus
    );
    event UpdateOrderDetails(uint256 indexed orderId, string newOrderDetails);
    event SubOrderIsFulfilled(uint256 indexed subOrderId);
    event OrderCreated(
        uint256 orderId,
        uint256 totalPrice,
        address currency,
        uint256 pubId,
        uint256 profileId,
        address buyer
    );
    event NFTOnlyOrderCreated(
        uint256 orderId,
        uint256 totalPrice,
        address currency,
        uint256 pubId,
        uint256 profileId,
        address buyer
    );
    event UpdateOrderMessage(uint256 indexed orderId, string newMessageDetails);
    event UpdateNFTOnlyOrderMessage(
        uint256 indexed orderId,
        string newMessageDetails
    );

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyMarketContract() {
        if (msg.sender != address(marketCreator)) {
            revert InvalidAddress();
        }
        _;
    }
    modifier onlyFulfiller(address _fulfiller) {
        if (_fulfiller != msg.sender) {
            revert InvalidFulfiller();
        }
        _;
    }
    modifier fulfillerIncluded(uint256[] memory _subOrderIds) {
        bool isFulfiller = false;
        for (uint256 i = 0; i < _subOrderIds.length; i++) {
            if (_subOrders[_subOrderIds[i]].fulfiller == msg.sender) {
                isFulfiller = true;
                break;
            }
        }
        if (!isFulfiller) {
            revert InvalidFulfiller();
        }
        _;
    }

    constructor(
        address _printAccessControlAddress,
        address _printDesignDataAddress
    ) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        printDesignData = PrintDesignData(_printDesignDataAddress);
        _orderSupply = 0;
        _subOrderSupply = 0;
        _nftOnlyOrderSupply = 0;
        symbol = "POD";
        name = "PrintOrderData";
    }

    function createOrder(
        uint256[] memory _subOrderIds,
        string memory _details,
        address _chosenCurrency,
        address _buyer,
        uint256 _pubId,
        uint256 _profileId,
        uint256 _buyerProfileId,
        uint256 _totalPrice,
        bool _withPKP
    ) external onlyMarketContract {
        _orderSupply++;
        PrintLibrary.Order memory newOrder = PrintLibrary.Order({
            orderId: _orderSupply,
            pubId: _pubId,
            profileId: _profileId,
            buyerProfileId: _buyerProfileId,
            subOrderIds: _subOrderIds,
            details: _details,
            buyer: _buyer,
            chosenCurrency: _chosenCurrency,
            timestamp: block.timestamp,
            messages: new string[](0),
            totalPrice: _totalPrice,
            withPKP: _withPKP
        });

        _orders[_orderSupply] = newOrder;
        _addressToOrderIds[_buyer].push(_orderSupply);

        emit OrderCreated(
            _orderSupply,
            _totalPrice,
            _chosenCurrency,
            _pubId,
            _profileId,
            _buyer
        );
    }

    function createNFTOnlyOrder(
        uint256[] memory _tokenIds,
        address _chosenCurrency,
        address _buyer,
        uint256 _pubId,
        uint256 _profileId,
        uint256 _buyerProfileId,
        uint256 _totalPrice,
        uint256 _collectionId,
        uint256 _amount
    ) external onlyMarketContract {
        _nftOnlyOrderSupply++;
        PrintLibrary.NFTOnlyOrder memory newOrder = PrintLibrary.NFTOnlyOrder({
            orderId: _nftOnlyOrderSupply,
            pubId: _pubId,
            profileId: _profileId,
            buyerProfileId: _buyerProfileId,
            amount: _amount,
            buyer: _buyer,
            chosenCurrency: _chosenCurrency,
            timestamp: block.timestamp,
            messages: new string[](0),
            totalPrice: _totalPrice,
            collectionId: _collectionId,
            tokenIds: _tokenIds
        });

        _nftOnlyOrders[_nftOnlyOrderSupply] = newOrder;

        _addressToNFTOnlyOrderIds[_buyer].push(_nftOnlyOrderSupply);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _communityHelperAddressToTokenIds[_buyer].push(_tokenIds[i]);
        }

        emit NFTOnlyOrderCreated(
            _nftOnlyOrderSupply,
            _totalPrice,
            _chosenCurrency,
            _pubId,
            _profileId,
            _buyer
        );
    }

    function createSubOrder(
        uint256[] memory _tokenIds,
        address _fullfiller,
        address _buyer,
        uint256 _amount,
        uint256 _orderId,
        uint256 _price,
        uint256 _collectionId
    ) external onlyMarketContract {
        _subOrderSupply++;
        PrintLibrary.SubOrder memory newSubOrder = PrintLibrary.SubOrder({
            subOrderId: _subOrderSupply,
            collectionId: _collectionId,
            tokenIds: _tokenIds,
            amount: _amount,
            orderId: _orderId,
            price: _price,
            status: PrintLibrary.OrderStatus.Designing,
            isFulfilled: false,
            fulfiller: _fullfiller
        });

        _subOrders[_subOrderSupply] = newSubOrder;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _communityHelperAddressToTokenIds[_buyer].push(_tokenIds[i]);
        }
    }

    function setSubOrderisFulfilled(
        uint256 _subOrderId
    ) external onlyFulfiller(_subOrders[_subOrderId].fulfiller) {
        _subOrders[_subOrderId].isFulfilled = true;
        emit SubOrderIsFulfilled(_subOrderId);
    }

    function setSubOrderStatus(
        uint256 _subOrderId,
        PrintLibrary.OrderStatus _status
    ) external onlyFulfiller(_subOrders[_subOrderId].fulfiller) {
        _subOrders[_subOrderId].status = _status;
        emit UpdateSubOrderStatus(_subOrderId, _status);
    }

    function setOrderDetails(
        string memory _newDetails,
        uint256 _orderId
    ) external {
        if (_orders[_orderId].buyer != msg.sender) {
            revert InvalidAddress();
        }
        _orders[_orderId].details = _newDetails;
        emit UpdateOrderDetails(_orderId, _newDetails);
    }

    function setOrderMessage(
        string memory _newMessage,
        uint256 _orderId
    ) external fulfillerIncluded(_orders[_orderId].subOrderIds) {
        _orders[_orderId].messages.push(_newMessage);
        emit UpdateOrderMessage(_orderId, _newMessage);
    }

    function setNFTOnlyOrderMessage(
        string memory _newMessage,
        uint256 _orderId
    ) external {
        if (
            msg.sender !=
            printDesignData.getCollectionCreator(
                _nftOnlyOrders[_orderId].collectionId
            )
        ) {
            revert InvalidAddress();
        }
        _nftOnlyOrders[_orderId].messages.push(_newMessage);
        emit UpdateNFTOnlyOrderMessage(_orderId, _newMessage);
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function setMarketCreatorAddress(
        address _newMarketCreatorAddress
    ) public onlyAdmin {
        marketCreator = MarketCreator(_newMarketCreatorAddress);
    }

    function setPrintDesignDataAddress(
        address _newPrintDesignDataAddress
    ) public onlyAdmin {
        printDesignData = PrintDesignData(_newPrintDesignDataAddress);
    }

    function getSubOrderTokenIds(
        uint256 _subOrderId
    ) public view returns (uint256[] memory) {
        return _subOrders[_subOrderId].tokenIds;
    }

    function getOrderDetails(
        uint256 _orderId
    ) public view returns (string memory) {
        return _orders[_orderId].details;
    }

    function getOrderMessages(
        uint256 _orderId
    ) public view returns (string[] memory) {
        return _orders[_orderId].messages;
    }

    function getOrderBuyer(uint256 _orderId) public view returns (address) {
        return _orders[_orderId].buyer;
    }

    function getOrderBuyerProfileId(
        uint256 _orderId
    ) public view returns (uint256) {
        return _orders[_orderId].buyerProfileId;
    }

    function getOrderChosenCurrency(
        uint256 _orderId
    ) public view returns (address) {
        return _orders[_orderId].chosenCurrency;
    }

    function getOrderWithPKP(uint256 _orderId) public view returns (bool) {
        return _orders[_orderId].withPKP;
    }

    function getOrderTimestamp(uint256 _orderId) public view returns (uint256) {
        return _orders[_orderId].timestamp;
    }

    function getOrderTotalPrice(
        uint256 _orderId
    ) public view returns (uint256) {
        return _orders[_orderId].totalPrice;
    }

    function getOrderPubId(uint256 _orderId) public view returns (uint256) {
        return _orders[_orderId].pubId;
    }

    function getOrderProfileId(uint256 _orderId) public view returns (uint256) {
        return _orders[_orderId].profileId;
    }

    function getSubOrderStatus(
        uint256 _subOrderId
    ) public view returns (PrintLibrary.OrderStatus) {
        return _subOrders[_subOrderId].status;
    }

    function getSubOrderIsFulfilled(
        uint256 _subOrderId
    ) public view returns (bool) {
        return _subOrders[_subOrderId].isFulfilled;
    }

    function getSubOrderFulfiller(
        uint256 _subOrderId
    ) public view returns (address) {
        return _subOrders[_subOrderId].fulfiller;
    }

    function getSubOrderOrderId(
        uint256 _subOrderId
    ) public view returns (uint256) {
        return _subOrders[_subOrderId].orderId;
    }

    function getSubOrderCollectionId(
        uint256 _subOrderId
    ) public view returns (uint256) {
        return _subOrders[_subOrderId].collectionId;
    }

    function getSubOrderAmount(
        uint256 _subOrderId
    ) public view returns (uint256) {
        return _subOrders[_subOrderId].amount;
    }

    function getSubOrderPrice(
        uint256 _subOrderId
    ) public view returns (uint256) {
        return _subOrders[_subOrderId].price;
    }

    function getOrderSubOrders(
        uint256 _orderId
    ) public view returns (uint256[] memory) {
        return _orders[_orderId].subOrderIds;
    }

    function getAddressToTokenIds(
        address _address
    ) public view returns (uint256[] memory) {
        return _communityHelperAddressToTokenIds[_address];
    }

    function getOrderSupply() public view returns (uint256) {
        return _orderSupply;
    }

    function getSubOrderSupply() public view returns (uint256) {
        return _subOrderSupply;
    }

    function getNFTOnlyOrderSupply() public view returns (uint256) {
        return _nftOnlyOrderSupply;
    }

    function getNFTOnlyOrderPubId(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].pubId;
    }

    function getNFTOnlyOrderProfileId(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].profileId;
    }

    function getNFTOnlyOrderChosenCurrency(
        uint256 _orderId
    ) public view returns (address) {
        return _nftOnlyOrders[_orderId].chosenCurrency;
    }

    function getNFTOnlyOrderTimestamp(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].timestamp;
    }

    function getNFTOnlyOrderMessages(
        uint256 _orderId
    ) public view returns (string[] memory) {
        return _nftOnlyOrders[_orderId].messages;
    }

    function getNFTOnlyOrderTotalPrice(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].totalPrice;
    }

    function getNFTOnlyOrderCollectionId(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].collectionId;
    }

    function getNFTOnlyOrderBuyer(
        uint256 _orderId
    ) public view returns (address) {
        return _nftOnlyOrders[_orderId].buyer;
    }

    function getNFTOnlyOrderBuyerProfileId(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].buyerProfileId;
    }

    function getNFTOnlyOrderAmount(
        uint256 _orderId
    ) public view returns (uint256) {
        return _nftOnlyOrders[_orderId].amount;
    }

    function getNFTOnlyOrderTokenIds(
        uint256 _orderId
    ) public view returns (uint256[] memory) {
        return _nftOnlyOrders[_orderId].tokenIds;
    }

    function getAddressToNFTOnlyOrderIds(
        address _address
    ) public view returns (uint256[] memory) {
        return _addressToNFTOnlyOrderIds[_address];
    }

    function getAddressToOrderIds(
        address _address
    ) public view returns (uint256[] memory) {
        return _addressToOrderIds[_address];
    }
}
