// SPDX-License-Identifier: MIT

pragma solidity =0.8.29;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleBank is ERC20 {
    error InvalidAmount(uint256 amount, uint256 currentUserBalance);

    event Deposited(address indexed from, address indexed to, uint256 amount);
    event Withdrawn(address indexed from, uint256 amount);

    constructor() ERC20("Simple Bank", "SBANK") {}

    function deposit() external payable {
        _mint(msg.sender, msg.value);
        emit Deposited(msg.sender, msg.sender, msg.value);
    }

    function depositFor(address recipient) external payable {
        _mint(recipient, msg.value);
        emit Deposited(msg.sender, recipient, msg.value);
    }

    function withdraw(uint256 amount) external {
        uint256 currentUserBalance = balanceOf(msg.sender);
        require(
            0 < amount && amount <= currentUserBalance,
            InvalidAmount(amount, currentUserBalance)
        );
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }
}
