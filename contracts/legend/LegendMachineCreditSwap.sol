// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.19;

import "./../MachineAccessControl.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LegendMachineCreditSwap {
    MachineAccessControl public machineAccessControl;
    IUniswapV2Router02 public uniswapRouter;
    string public symbol;
    string public name;
    // address public constant UNISWAP_ROUTER_ADDRESS = "";
    address public legendEscrow;
    address public monaAddress;

    error InvalidAddress();

    event CreditsSwapped(address fromCurrency, address caller, uint256 amount);
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

    constructor(address _machineAccessControlAddress) {
        machineAccessControl = MachineAccessControl(
            _machineAccessControlAddress
        );
        // uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        symbol = "LMCS";
        name = "LegendMachineCreditSwap";
    }

    function receiveAndSwapCredits(
        address _currency,
        uint256 _amount
    ) external onlyLegendEscrow {
        IERC20(_currency).transferFrom(legendEscrow, address(this), _amount);

        _swapCreditsToMona(_currency, _amount);

        emit CreditsSwapped(_currency, msg.sender, _amount);
    }

    function moveCredits(
        address _moveAddress,
        uint256 _amount
    ) external onlyAdminOrMachine {
        IERC20(monaAddress).transferFrom(address(this), _moveAddress, _amount);

        emit CreditsMoved(_moveAddress, msg.sender, _amount);
    }

    function _swapCreditsToMona(address _currency, uint256 _amount) private {
        IERC20(_currency).approve(address(uniswapRouter), _amount);

        address[] memory _path = new address[](2);
        _path[0] = _currency;
        _path[1] = monaAddress;

        uniswapRouter.swapExactTokensForTokens(
            _amount,
            0,
            _path,
            address(this),
            block.timestamp
        );
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
}
