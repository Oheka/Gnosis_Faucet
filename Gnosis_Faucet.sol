// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GnosisFaucet {
    uint256 public constant CLAIM_AMOUNT = 1 ether; 
    uint256 public constant CLAIM_INTERVAL = 1 days;

    mapping(address => uint256) private lastClaimed;

    event Claimed(address indexed claimant, uint256 amount);

    constructor() payable {}

    function claim() external {
        require(block.timestamp >= lastClaimed[msg.sender] + CLAIM_INTERVAL, "You must wait before claiming again.");
        require(address(this).balance >= CLAIM_AMOUNT, "Faucet is empty.");

        lastClaimed[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(CLAIM_AMOUNT);

        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }

    receive() external payable {}

    function withdrawAll() external {
        require(msg.sender == tx.origin, "Only EOA can withdraw.");
        payable(msg.sender).transfer(address(this).balance);
    }
}
