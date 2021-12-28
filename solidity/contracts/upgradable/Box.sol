//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Box {
    uint256 public value;

    event NewValue(uint256 value);

    function store(uint256 newValue) public {
        value = newValue;
        emit NewValue(newValue);
    }

    function retrieve() public returns (uint256) {
        return value;
    }
}
