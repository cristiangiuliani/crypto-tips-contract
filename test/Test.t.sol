// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test as ForgeTest} from "forge-std/Test.sol";
import {Test as TestContract} from "../src/Test.sol";

contract TestContractTest is ForgeTest {
    TestContract public testContract;

    // setUp viene eseguito prima di ogni test
    function setUp() public {
        testContract = new TestContract();
    }

    // Test base: verifica che la stringa iniziale sia vuota
    function test_InitialStringIsEmpty() public {
        assertEq(testContract.getString(), "");
    }

    // Test: imposta e leggi una stringa
    function test_SetAndGetString() public {
        string memory newString = "Hello, Foundry!";
        testContract.setString(newString);
        assertEq(testContract.getString(), newString);
    }

    // Test: imposta stringa vuota
    function test_SetEmptyString() public {
        testContract.setString("First");
        testContract.setString("");
        assertEq(testContract.getString(), "");
    }

    // Fuzz test: testa con stringhe random
    function testFuzz_SetString(string memory randomString) public {
        testContract.setString(randomString);
        assertEq(testContract.getString(), randomString);
    }

    // Test che dovrebbe fallire (esempio)
    // function testFail_Example() public {
    //     testContract.setString("test");
    //     assertEq(testContract.getString(), "wrong");
    // }
}
