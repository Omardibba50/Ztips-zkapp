// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZTipsToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ZTips Token", "ZTT") {
        _mint(msg.sender, initialSupply);
    }
}