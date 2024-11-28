// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GnosisFaucet {
    uint256 public constant CLAIM_AMOUNT = 0.0005 ether; 
    uint256 public constant CLAIM_INTERVAL = 7 days;

    address public owner;
    mapping(address => uint256) private lastClaimed;

    event Claimed(address indexed claimant, uint256 amount);
    event FaucetFunded(address indexed funder, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() payable {
        owner = msg.sender;
    }

    function claim() external {
        require(block.timestamp >= lastClaimed[msg.sender] + CLAIM_INTERVAL, "You must wait before claiming again.");
        require(address(this).balance >= CLAIM_AMOUNT, "Faucet is empty.");

        lastClaimed[msg.sender] = block.timestamp;

        (bool success, ) = msg.sender.call{value: CLAIM_AMOUNT}("");
        require(success, "Transfer failed.");

        emit Claimed(msg.sender, CLAIM_AMOUNT);
    }

    receive() external payable {
        emit FaucetFunded(msg.sender, msg.value);
    }

    function withdrawAll() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getRemainingBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTimeUntilNextClaim(address user) external view returns (uint256) {
        if (block.timestamp >= lastClaimed[user] + CLAIM_INTERVAL) {
            return 0;
        }
        return (lastClaimed[user] + CLAIM_INTERVAL) - block.timestamp;
    }
}
