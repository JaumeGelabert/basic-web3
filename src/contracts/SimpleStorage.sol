// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// El siguiente contrato permite guardar texto y modificarlo
contract SimpleStorage {
    //data point
    string public storedData;

    event myEventTest(string eventOutput);

    function set(string memory myText) public {
        storedData = myText;
        emit myEventTest(myText);
    }

    function get() public view returns (string memory) {
        return storedData;
    }
}
