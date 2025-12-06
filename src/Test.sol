// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test {
    string public storedString;
    function getString() public view returns (string memory) {
        return storedString;
    }
    function setString(string memory newString) public {
        storedString = newString;
    }
}
