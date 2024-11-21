// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GnosisFaucet {
    // Owner of the contract
    address public owner;

    // Mapping to track last claim time per address
    mapping(address => uint256) public lastClaimTime;

    // Amount to be distributed per claim (0.1 xDAI)
    uint256 public constant CLAIM_AMOUNT = 0.1 ether;

    // Minimum time between claims (24 hours in seconds)
    uint256 public constant CLAIM_INTERVAL = 1 days;

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to initialize the owner
    constructor() {
        owner = 0x392eB197a89060CF6bA53ac5C3822AFffA5789Ae;
    }

    // Function to claim xDAI
    function claim() external {
        require(address(this).balance >= CLAIM_AMOUNT, "Faucet balance is too low");
        require(
            block.timestamp >= lastClaimTime[msg.sender] + CLAIM_INTERVAL,
            "You can only claim once every 24 hours"
        );

        // Update the last claim time
        lastClaimTime[msg.sender] = block.timestamp;

        // Send the CLAIM_AMOUNT to the caller
        payable(msg.sender).transfer(CLAIM_AMOUNT);
    }

    // Function for the owner to deposit funds into the faucet
    function deposit() external payable onlyOwner {}

    // Function to withdraw all funds (only by owner)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to accept plain ether transfers
    receive() external payable {}
}
