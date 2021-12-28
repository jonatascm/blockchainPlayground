//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract BoxV2 {
    uint256 public value;

    event NewValue(uint256 value);

    function store(uint256 newValue) public {
        value = newValue;
        emit NewValue(newValue);
    }

    function retrieve() public view returns (uint256) {
        return value;
    }

    function increment() public {
        value = value + 1;
        emit NewValue(value);
    }
}
