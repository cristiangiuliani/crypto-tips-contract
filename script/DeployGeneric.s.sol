// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

// Import dei contratti
import {TipJar} from "../src/TipsJar.sol";
import {Counter} from "../src/Counter.sol";
import {Test} from "../src/Test.sol";

/**
 * @title DeployGeneric
 * @notice Script generico per deployare qualsiasi contratto
 * @dev Usa variabili d'ambiente per configurare il deploy:
 *      - CONTRACT_NAME: nome del contratto da deployare
 *      - INITIAL_STRING: parametro per Test contract
 * 
 * Usage:
 *   CONTRACT_NAME=TipJar forge script script/DeployGeneric.s.sol --broadcast
 *   CONTRACT_NAME=Counter forge script script/DeployGeneric.s.sol --broadcast
 *   CONTRACT_NAME=Test INITIAL_STRING="Hello" forge script script/DeployGeneric.s.sol --broadcast
 */
contract DeployGeneric is Script {
    function run() external {
        // Legge la variabile d'ambiente CONTRACT_NAME
        string memory contractName = vm.envString("CONTRACT_NAME");
        
        vm.startBroadcast();
        
        // Deploy basato sul nome del contratto
        if (keccak256(bytes(contractName)) == keccak256(bytes("TipJar"))) {
            TipJar tipJar = new TipJar();
            console.log("TipJar deployed to:", address(tipJar));
            console.log("Owner:", tipJar.owner());
        } 
        else if (keccak256(bytes(contractName)) == keccak256(bytes("Counter"))) {
            Counter counter = new Counter();
            console.log("Counter deployed to:", address(counter));
            console.log("Initial number:", counter.number());
        }
        else if (keccak256(bytes(contractName)) == keccak256(bytes("Test"))) {
            Test test = new Test();
            console.log("Test deployed to:", address(test));
            
            // Se è specificata una stringa iniziale, impostala
            string memory initialString = vm.envOr("INITIAL_STRING", string(""));
            if (bytes(initialString).length > 0) {
                test.setString(initialString);
                console.log("Initial string set to:", initialString);
            } else {
                console.log("No initial string provided");
            }
        }
        else {
            revert(string.concat("Unknown contract: ", contractName));
        }
        
        vm.stopBroadcast();
    }
}
