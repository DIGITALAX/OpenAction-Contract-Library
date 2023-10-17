// // SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.16;

import "./PrintAccessControl.sol";
import "./PrintLibrary.sol";

contract PrintSplitsData {
    PrintAccessControl public printAccessControl;
    mapping(address => mapping(PrintLibrary.PrintType => uint256))
        private _designerSplits;
    mapping(address => mapping(PrintLibrary.PrintType => uint256))
        private _fulfillerSplits;
    mapping(address => mapping(PrintLibrary.PrintType => uint256))
        private _treasurySplits;
    mapping(address => mapping(PrintLibrary.PrintType => uint256))
        private _fulfillerBases;
    mapping(address => bool) private _currencies;
    mapping(address => uint256) private _addressToRate;

    error addressNotAdmin();
    error existingCurrency();
    error currencyDoesntExist();
    error invalidCurrency();

    event FulfillerSplitSet(
        address fulfiller,
        PrintLibrary.PrintType printType,
        uint256 split
    );
    event FulfillerBaseSet(
        address fulfiller,
        PrintLibrary.PrintType printType,
        uint256 split
    );
    event DesignerSplitSet(
        address fulfiller,
        PrintLibrary.PrintType printType,
        uint256 split
    );
    event TreasurySplitSet(
        address fulfiller,
        PrintLibrary.PrintType printType,
        uint256 split
    );
    event CurrencyAdded(address indexed currency);
    event CurrencyRemoved(address indexed currency);
    event OracleUpdated(address indexed currency, uint256 rate);

    modifier onlyAdmin() {
        if (!printAccessControl.isAdmin(msg.sender)) {
            revert addressNotAdmin();
        }
        _;
    }

    constructor(address _printAccessControlAddress) {
        printAccessControl = PrintAccessControl(_printAccessControlAddress);
    }

    function setFulfillerSplit(
        address _address,
        PrintLibrary.PrintType _printType,
        uint256 _amount
    ) external onlyAdmin {
        _fulfillerSplits[_address][_printType] = _amount;

        emit FulfillerSplitSet(_address, _printType, _amount);
    }

    function setFulfillerBase(
        address _address,
        PrintLibrary.PrintType _printType,
        uint256 _amount
    ) external onlyAdmin {
        _fulfillerBases[_address][_printType] = _amount;
        emit FulfillerBaseSet(_address, _printType, _amount);
    }

    function setDesignerSplit(
        address _address,
        PrintLibrary.PrintType _printType,
        uint256 _amount
    ) external onlyAdmin {
        _designerSplits[_address][_printType] = _amount;
        emit DesignerSplitSet(_address, _printType, _amount);
    }

    function setTreasurySplit(
        address _address,
        PrintLibrary.PrintType _printType,
        uint256 _amount
    ) external onlyAdmin {
        _treasurySplits[_address][_printType] = _amount;
        emit TreasurySplitSet(_address, _printType, _amount);
    }

    function addCurrency(address _currency) external onlyAdmin {
        if (_currencies[_currency]) {
            revert existingCurrency();
        }
        _currencies[_currency] = true;
        emit CurrencyAdded(_currency);
    }

    function removeCurrency(address _currency) external onlyAdmin {
        if (!_currencies[_currency]) {
            revert currencyDoesntExist();
        }
        _currencies[_currency] = false;
        emit CurrencyRemoved(_currency);
    }

    function setOraclePriceUSD(
        address _currencyAddress,
        uint256 _rate
    ) public onlyAdmin {
        if (!_currencies[_currencyAddress]) {
            revert invalidCurrency();
        }

        _addressToRate[_currencyAddress] = _rate;
        emit OracleUpdated(_currencyAddress, _rate);
    }

    function getFulfillerBase(
        address _address,
        PrintLibrary.PrintType _printType
    ) public view returns (uint256) {
        return _fulfillerBases[_address][_printType];
    }

    function getFulfillerSplit(
        address _address,
        PrintLibrary.PrintType _printType
    ) public view returns (uint256) {
        return _fulfillerSplits[_address][_printType];
    }

    function getDesignerSplit(
        address _address,
        PrintLibrary.PrintType _printType
    ) public view returns (uint256) {
        return _designerSplits[_address][_printType];
    }

    function getTreasurySplit(
        address _address,
        PrintLibrary.PrintType _printType
    ) public view returns (uint256) {
        return _treasurySplits[_address][_printType];
    }

    function setPrintAccessControlAddress(
        address _newPrintAccessControlAddress
    ) public onlyAdmin {
        printAccessControl = PrintAccessControl(_newPrintAccessControlAddress);
    }

    function getIsCurrency(address _address) public view returns (bool) {
        return _currencies[_address];
    }

    function getRateByAddress(
        address _tokenAddress
    ) public view returns (uint256) {
        return _addressToRate[_tokenAddress];
    }
}
