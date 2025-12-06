// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TipJar
 * @notice A simple contract that accepts ETH tips with custom messages
 * @dev All tips are immediately forwarded to the contract owner
 */
contract TipJar {
    // ============================================
    // STATE VARIABLES
    // ============================================

    /**
     * @notice Address that receives all tips
     * @dev Set once during deployment, cannot be changed
     */
    address payable public immutable owner;

    /**
     * @notice Counter for total number of tips received
     * @dev Incremented with each tip, useful for statistics
     */
    uint256 public totalTipsCount;

    // ============================================
    // EVENTS
    // ============================================

    /**
     * @notice Emitted when a tip is received
     * @dev Frontend listens to these events to display tips
     * @param sender Address of the person who sent the tip
     * @param amount Amount of ETH sent (in wei)
     * @param message Custom message attached to the tip
     * @param timestamp Block timestamp when tip was sent
     */
    event TipReceived(address indexed sender, uint256 amount, string message, uint256 timestamp);

    // ============================================
    // ERRORS
    // ============================================

    /**
     * @notice Thrown when someone tries to send a tip with 0 ETH
     */
    error TipMustBeGreaterThanZero();

    /**
     * @notice Thrown when message is too long (gas optimization)
     */
    error MessageTooLong();

    /**
     * @notice Thrown when only owner can call a function
     */
    error OnlyOwner();

    // ============================================
    // CONSTRUCTOR
    // ============================================

    /**
     * @notice Initializes the contract with owner address
     * @dev Owner is set to deployer address, stored as immutable for gas savings
     */
    constructor() {
        owner = payable(msg.sender);
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    /**
     * @notice Send a tip with a custom message
     * @dev Automatically forwards ETH to owner and emits event
     * @param _message Custom message to attach to the tip (max 280 chars)
     */
    function sendTip(string calldata _message) external payable {
        // Validation: tip must be > 0
        if (msg.value == 0) {
            revert TipMustBeGreaterThanZero();
        }

        // Validation: message length (280 chars like Twitter)
        // This saves gas and prevents spam
        if (bytes(_message).length > 280) {
            revert MessageTooLong();
        }

        // Increment counter
        totalTipsCount++;

        // Emit event BEFORE transferring (Checks-Effects-Interactions pattern)
        emit TipReceived(msg.sender, msg.value, _message, block.timestamp);

        // Transfer ETH to owner
        // Using call{value:} is the modern, safe way
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    /**
     * @notice Get the contract's current ETH balance
     * @dev Should always be 0 since tips are forwarded immediately
     * @return Current balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ============================================
    // EMERGENCY FUNCTIONS
    // ============================================

    /**
     * @notice Withdraw any stuck ETH (emergency only)
     * @dev Only owner can call. Should never be needed if sendTip works correctly
     */
    function emergencyWithdraw() external {
        if (msg.sender != owner) {
            revert OnlyOwner();
        }

        (bool success,) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Fallback function to receive ETH without message
     * @dev Direct ETH transfers will be accepted but won't emit event
     */
    receive() external payable {
        // Accept ETH but don't emit event
        // This allows people to send ETH directly if they want
        (bool success,) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}
