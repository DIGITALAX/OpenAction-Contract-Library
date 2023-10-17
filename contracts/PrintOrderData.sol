// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";
import "./MarketCreator.sol";

contract PrintOrderData {
    PrintAccessControl public printAccessControl;
    MarketCreator public marketCreator;
    uint256 private _orderSupply;
    uint256 private _subOrderSupply;
    mapping(uint256 => PrintLibrary.Order) private _orders;
    mapping(uint256 => PrintLibrary.SubOrder) private _subOrders;
    mapping(string => uint256[]) private _addressToOrderIds;

    error invalidAddress();
    error invalidFulfiller();

    event UpdateSubOrderStatus(
        uint256 indexed subOrderId,
        PrintLibrary.OrderStatus newSubOrderStatus
    );
    event UpdateOrderDetails(uint256 indexed orderId, string newOrderDetails);
    event SubOrderIsFulfilled(uint256 indexed subOrderId);
    event OrderCreated(
        uint256 orderId,
        uint256 totalPrice,
        uint256 level,
        address currency,
        uint256 pubId,
        uint256 profileId,
        address buyer
    );
    event UpdateOrderMessage(uint256 indexed orderId, string newMessageDetails);

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert invalidAddress();
        }
        _;
    }
    modifier onlyMarketContract() {
        if (msg.sender != address(marketCreator)) {
            revert invalidAddress();
        }
        _;
    }
    modifier onlyFulfiller(address _fulfiller) {
        if (_fulfiller == msg.sender) {
            revert invalidFulfiller();
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
            revert invalidFulfiller();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
        _orderSupply = 0;
        _subOrderSupply = 0;
    }

    function createOrder(
        uint256[] memory _subOrderIds,
        string memory _details,
        address _chosenCurrency,
        address _buyer,
        uint256 _pubId,
        uint256 _profileId,
        uint256 _totalPrice
    ) external onlyMarketContract {
        _orderSupply++;
        PrintLibrary.Order memory newOrder = PrintLibrary.Order({
            orderId: _orderSupply,
            pubId: _pubId,
            profileId: _profileId,
            subOrderIds: _subOrderIds,
            details: _details,
            buyer: _buyer,
            chosenCurrency: _chosenCurrency,
            timestamp: block.timestamp,
            messages: new string[](0),
            totalPrice: _totalPrice
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

    function createSubOrder(
        uint256[] memory _tokenIds,
        address _fullfiller,
        uint256 _amount,
        uint256 _orderId,
        uint256 _price
    ) external onlyMarketContract {
        _subOrderSupply++;
        PrintLibrary.SubOrder memory newSubOrder = PrintLibrary.SubOrder({
            subOrderId: _subOrderSupply,
            tokenIds: _tokenIds,
            amount: _amount,
            orderId: _orderId,
            price: _price,
            status: PrintLibrary.OrderStatus.Designing,
            isFulfilled: false,
            fulfiller: _fullfiller
        });

        _subOrders[_subOrderSupply] = newSubOrder;
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
        uint256 _orderId,
        string memory _newDetails
    ) external {
        if (_orders[_orderId].buyer != msg.sender) {
            revert invalidAddress();
        }
        _orders[_orderId].details = _newDetails;
        emit UpdateOrderDetails(_orderId, _newDetails);
    }

    function setOrderMessage(
        uint256 _orderId,
        string memory _newMessage
    ) external fulfillerIncluded(_orders[_orderId].subOrderIds) {
        _orders[_orderId].messages.push(_newMessage);
        emit UpdateOrderMessage(_orderId, _newMessage);
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

    function getOrderChosenCurrency(
        uint256 _orderId
    ) public view returns (address) {
        return _orders[_orderId].chosenCurrency;
    }

    function getOrderTimestamp(uint256 _orderId) public view returns (uint256) {
        return _orders[_orderId].timestamp;
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

    function getOrderSupply() public view returns (uint256) {
        return _orderSupply;
    }

    function getSubOrderSupply() public view returns (uint256) {
        return _subOrderSupply;
    }

    function getAddressToOrderIds(
        address _address
    ) public view returns (uint256[] memory) {
        return _addressToOrderIds[_address];
    }
}
