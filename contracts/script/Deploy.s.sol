// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {TipJar} from "../src/TipsJar.sol";
import {console} from "forge-std/console.sol";

/**
 * @title DeployTipJar
 * @notice Deployment script for TipJar contract
 * @dev Run with: forge script script/Deploy.s.sol --broadcast
 */
contract DeployTipJar is Script {
    function run() external returns (TipJar) {
        vm.startBroadcast();
        
        TipJar tipJar = new TipJar();
        
        console.log("TipJar deployed to:", address(tipJar));
        console.log("Owner:", tipJar.owner());
        
        vm.stopBroadcast();
        
        return tipJar;
    }
}
