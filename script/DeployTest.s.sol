// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Test} from "../src/Test.sol";
import {console} from "forge-std/console.sol";

/**
 * @title DeployTest
 * @notice Deployment script for Test contract
 * @dev Puoi usare variabili d'ambiente per personalizzare:
 *      INITIAL_STRING="Hello" forge script script/DeployTest.s.sol --broadcast
 */
contract DeployTest is Script {
    function run() external returns (Test) {
        vm.startBroadcast();
        
        Test test = new Test();
        
        // Imposta stringa iniziale se specificata
        string memory initialString = vm.envOr("INITIAL_STRING", string(""));
        if (bytes(initialString).length > 0) {
            test.setString(initialString);
            console.log("Initial string set to:", initialString);
        }
        
        console.log("Test deployed to:", address(test));
        console.log("Current string:", test.getString());
        
        vm.stopBroadcast();
        
        return test;
    }
}
