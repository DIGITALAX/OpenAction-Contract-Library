// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

import "./../MachineAccessControl.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LegendMachineCreditSwap {
    MachineAccessControl public machineAccessControl;
    ISwapRouter public immutable swapRouter;
    string public symbol;
    string public name;
    address public legendEscrow;
    address public monaAddress;
    uint24 public poolFee;

    error InvalidAddress();

    event SwapCredits(address currency, uint256 amount);
    event CreditsSwapped(
        address fromCurrency,
        address caller,
        uint256 amountIn,
        uint256 amountOut
    );
    event CreditsMoved(address moveAddress, address caller, uint256 amount);

    modifier onlyLegendEscrow() {
        if (msg.sender != legendEscrow) {
            revert InvalidAddress();
        }
        _;
    }

    modifier onlyAdminOrMachine() {
        if (
            !machineAccessControl.isAdmin(msg.sender) &&
            !machineAccessControl.isMachine(msg.sender)
        ) {
            revert InvalidAddress();
        }
        _;
    }

    constructor(address _machineAccessControlAddress, address _routerAddress) {
        machineAccessControl = MachineAccessControl(
            _machineAccessControlAddress
        );
        swapRouter = ISwapRouter(_routerAddress);
        symbol = "LMCS";
        name = "LegendMachineCreditSwap";
        poolFee = 3000;
    }

    function receiveAndSwapCredits(
        address _currency,
        uint256 _amount
    ) external onlyLegendEscrow {
        IERC20(_currency).transferFrom(legendEscrow, address(this), _amount);

        uint256 _amountOut = _amount;

        if (_currency != monaAddress) {
            _amountOut = _swapCreditsToMona(_currency, _amount);
        }

        emit CreditsSwapped(_currency, legendEscrow, _amount, _amountOut);
    }

    function moveCredits(
        address _moveAddress,
        uint256 _amount
    ) external onlyAdminOrMachine {
        IERC20(monaAddress).transferFrom(address(this), _moveAddress, _amount);

        emit CreditsMoved(_moveAddress, msg.sender, _amount);
    }

    function _swapCreditsToMona(
        address _currency,
        uint256 _amount
    ) private returns (uint256) {
        IERC20(_currency).approve(address(swapRouter), _amount);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _currency,
                tokenOut: monaAddress,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: _amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }

    function setLegendEscrowAddress(
        address _legendEscrowAddress
    ) public onlyAdminOrMachine {
        legendEscrow = _legendEscrowAddress;
    }

    function setMonaAddress(address _monaAddress) public onlyAdminOrMachine {
        monaAddress = _monaAddress;
    }

    function setMachineAccessControl(
        address _machineAccessControlAddress
    ) public onlyAdminOrMachine {
        machineAccessControl = MachineAccessControl(
            _machineAccessControlAddress
        );
    }

    function changePoolFee(uint24 _newPoolFee) public onlyAdminOrMachine {
        poolFee = _newPoolFee;
    }
}
