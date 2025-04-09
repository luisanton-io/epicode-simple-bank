// SPDX-License-Identifier: MIT

pragma solidity =0.8.29;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SimpleBank is ERC20 {
    address public admin;

    error Unauthorized(address account);
    error InvalidAmount(uint256 amount, uint256 currentUserBalance);

    event Deposited(address indexed from, address indexed to, uint256 amount);
    event Withdrawn(address indexed from, uint256 amount);

    constructor() ERC20('Simple Bank', 'SBANK') {
        admin = msg.sender;
    }

    function setAdmin(address newAdmin) public {
        require(admin == msg.sender, Unauthorized(msg.sender));
        admin = newAdmin;
    }

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

    /**
     * @notice On transfer, the receiver only gets 99% of the sent amount.
     * A special account gets the remaining 1%.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        // If from is the special account, bypass the fee
        if (msg.sender != admin) {
            uint256 onePc;
            onePc = value / 100;
            value -= onePc;

            // unchecked {
            //     onePc = (value / 100);
            //     value -= onePc;
            // }

            // assembly {
            //     onePc := div(value, 100)
            //     value := sub(value, onePc)
            // }

            super._update(from, admin, onePc); // Admin receives 1%
        }

        super._update(from, to, value); // Recipient receives 99%
    }
}
