//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./SampleToken.sol";

contract SampleTokenFactory {
    SampleToken[] public sampleTokenArray;
    uint256 public totalTokens = 0;

    function createSampleTokenContract() public {
        SampleToken sampleToken = new SampleToken();
        sampleTokenArray.push(sampleToken);
        totalTokens++;
    }

    function factoryTransfer(
        uint256 _sampleTokenIndex,
        uint256 _tokenAmount,
        address _to
    ) public {
        SampleToken sampleToken = SampleToken(
            address(sampleTokenArray[_sampleTokenIndex])
        );
        sampleToken.transfer(_to, _tokenAmount);
    }

    function factoryBalanceOf(uint256 _sampleTokenIndex, address _address)
        public
        view
        returns (uint256)
    {
        SampleToken sampleToken = SampleToken(
            address(sampleTokenArray[_sampleTokenIndex])
        );
        return
            sampleToken.balanceOf(
                _address != address(0) ? _address : address(this)
            );
    }
}
