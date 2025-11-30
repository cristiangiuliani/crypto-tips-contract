// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";
import {console} from "forge-std/console.sol";

/**
 * @title DeployCounter
 * @notice Deployment script for Counter contract
 */
contract DeployCounter is Script {
    function run() external returns (Counter) {
        vm.startBroadcast();
        
        Counter counter = new Counter();
        console.log("Counter deployed to:", address(counter));
        console.log("Initial number:", counter.number());
        
        // Incrementa il counter 5 volte
        console.log("\nIncrementing counter...");
        for (uint256 i = 0; i < 5; i++) {
            counter.increment();
            console.log("After increment", i + 1, ":", counter.number());
        }
        
        console.log("\nFinal number:", counter.number());
        
        vm.stopBroadcast();
        
        return counter;
    }
}
