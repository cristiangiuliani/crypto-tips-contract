// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {TipJar} from "../src/TipsJar.sol";

/**
 * @title TipJarTest
 * @notice Comprehensive tests for TipJar contract
 */
contract TipJarTest is Test {
    // ============================================
    // STATE VARIABLES
    // ============================================

    TipJar public tipJar;

    address public owner = address(1); // Contract owner
    address public tipper1 = address(2); // First tipper
    address public tipper2 = address(3); // Second tipper

    // ============================================
    // SETUP
    // ============================================

    /**
     * @notice Runs before each test
     * @dev Deploy fresh TipJar contract and fund test accounts
     */
    function setUp() public {
        // Deploy contract as owner
        vm.prank(owner);
        tipJar = new TipJar();

        // Fund test accounts with 10 ETH each
        vm.deal(tipper1, 10 ether);
        vm.deal(tipper2, 10 ether);

        // Label addresses for better trace output
        vm.label(owner, "Owner");
        vm.label(tipper1, "Tipper1");
        vm.label(tipper2, "Tipper2");
    }

    // ============================================
    // CONSTRUCTOR TESTS
    // ============================================

    function test_ConstructorSetsOwner() public view {
        assertEq(tipJar.owner(), owner, "Owner should be set correctly");
    }

    function test_InitialTipsCountIsZero() public view {
        assertEq(tipJar.totalTipsCount(), 0, "Initial tips count should be 0");
    }

    // ============================================
    // SEND TIP - SUCCESS CASES
    // ============================================

    function test_SendTipSuccess() public {
        // Arrange
        uint256 tipAmount = 1 ether;
        string memory message = "Great content!";
        uint256 ownerBalanceBefore = owner.balance;

        // Act
        vm.prank(tipper1);
        tipJar.sendTip{value: tipAmount}(message);

        // Assert
        assertEq(owner.balance, ownerBalanceBefore + tipAmount, "Owner should receive tip amount");
        assertEq(tipJar.totalTipsCount(), 1, "Tips count should increment");
    }

    function test_SendTipEmitsEvent() public {
        // Arrange
        uint256 tipAmount = 0.5 ether;
        string memory message = "Thanks!";

        // Expect event to be emitted
        vm.expectEmit(true, false, false, true);
        emit TipJar.TipReceived(tipper1, tipAmount, message, block.timestamp);

        // Act
        vm.prank(tipper1);
        tipJar.sendTip{value: tipAmount}(message);
    }

    function test_MultipleTipsIncrement() public {
        // Send 3 tips
        vm.prank(tipper1);
        tipJar.sendTip{value: 1 ether}("First");

        vm.prank(tipper2);
        tipJar.sendTip{value: 2 ether}("Second");

        vm.prank(tipper1);
        tipJar.sendTip{value: 0.5 ether}("Third");

        // Assert count
        assertEq(tipJar.totalTipsCount(), 3, "Should have 3 tips");
    }

    function test_SendTipWithMaxLengthMessage() public {
        // Create 280 character message (max allowed)
        string memory longMessage = "a";
        for (uint256 i = 0; i < 279; i++) {
            longMessage = string.concat(longMessage, "a");
        }

        // Should succeed
        vm.prank(tipper1);
        tipJar.sendTip{value: 1 ether}(longMessage);

        assertEq(tipJar.totalTipsCount(), 1);
    }

    function test_SendTipWithEmptyMessage() public {
        // Empty message should be allowed
        vm.prank(tipper1);
        tipJar.sendTip{value: 1 ether}("");

        assertEq(tipJar.totalTipsCount(), 1);
    }

    // ============================================
    // SEND TIP - FAILURE CASES
    // ============================================

    function test_RevertWhen_TipIsZero() public {
        vm.prank(tipper1);
        vm.expectRevert(TipJar.TipMustBeGreaterThanZero.selector);
        tipJar.sendTip{value: 0}("No money!");
    }

    function test_RevertWhen_MessageTooLong() public {
        // Create 281 character message (too long)
        string memory tooLongMessage = "a";
        for (uint256 i = 0; i < 280; i++) {
            tooLongMessage = string.concat(tooLongMessage, "a");
        }

        vm.prank(tipper1);
        vm.expectRevert(TipJar.MessageTooLong.selector);
        tipJar.sendTip{value: 1 ether}(tooLongMessage);
    }

    // ============================================
    // VIEW FUNCTIONS TESTS
    // ============================================

    function test_GetBalanceIsZeroAfterTip() public {
        // Send tip
        vm.prank(tipper1);
        tipJar.sendTip{value: 1 ether}("Test");

        // Contract balance should be 0 (all forwarded to owner)
        assertEq(tipJar.getBalance(), 0, "Contract balance should be 0 after forwarding");
    }

    // ============================================
    // EMERGENCY WITHDRAW TESTS
    // ============================================

    function test_EmergencyWithdraw_OnlyOwner() public {
        // Fund contract directly (simulate stuck ETH)
        vm.deal(address(tipJar), 5 ether);

        uint256 ownerBalanceBefore = owner.balance;

        // Owner withdraws
        vm.prank(owner);
        tipJar.emergencyWithdraw();

        assertEq(owner.balance, ownerBalanceBefore + 5 ether, "Owner should receive stuck ETH");
        assertEq(address(tipJar).balance, 0, "Contract balance should be 0");
    }

    function test_RevertWhen_NonOwnerCallsEmergencyWithdraw() public {
        vm.prank(tipper1);
        vm.expectRevert(TipJar.OnlyOwner.selector);
        tipJar.emergencyWithdraw();
    }

    // ============================================
    // RECEIVE FUNCTION TESTS
    // ============================================

    function test_ReceiveETHDirectly() public {
        uint256 ownerBalanceBefore = owner.balance;

        // Send ETH directly to contract (no message)
        vm.prank(tipper1);
        (bool success,) = address(tipJar).call{value: 1 ether}("");

        assertTrue(success, "Direct ETH transfer should succeed");
        assertEq(owner.balance, ownerBalanceBefore + 1 ether, "Owner should receive direct transfer");
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    /**
     * @notice Fuzz test with random tip amounts
     * @dev Foundry will run this with many random values
     */
    function testFuzz_SendTipWithRandomAmount(uint256 tipAmount) public {
        // Bound amount between 0.001 ETH and 100 ETH
        tipAmount = bound(tipAmount, 0.001 ether, 100 ether);

        // Fund tipper
        vm.deal(tipper1, tipAmount);

        uint256 ownerBalanceBefore = owner.balance;

        // Send tip
        vm.prank(tipper1);
        tipJar.sendTip{value: tipAmount}("Random amount");

        // Assert
        assertEq(owner.balance, ownerBalanceBefore + tipAmount, "Owner should receive exact tip amount");
    }

    /**
     * @notice Fuzz test with random message lengths
     */
    function testFuzz_SendTipWithRandomMessage(string calldata randomMessage) public {
        // Only test if message is within valid length
        vm.assume(bytes(randomMessage).length <= 280);

        vm.prank(tipper1);
        tipJar.sendTip{value: 1 ether}(randomMessage);

        assertEq(tipJar.totalTipsCount(), 1);
    }

    // ============================================
    // INVARIANT TESTS
    // ============================================

    /**
     * @notice Invariant: Contract balance should always be 0
     * @dev All tips are immediately forwarded to owner
     */
    function invariant_ContractBalanceIsZero() public view {
        assertEq(address(tipJar).balance, 0, "Contract should never hold ETH");
    }
}
