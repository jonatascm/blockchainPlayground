//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract FundMe {
    using SafeMath for uint256;
    AggregatorV3Interface internal priceFeed;
    mapping(address => uint256) public addressToAmountFunded;
    address public owner;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    constructor() {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(
            0x9326BFA02ADD2366b30bacB125260Af641031331
        );
    }

    /**
     * Minimum $50
     */
    function fund() public payable {
        uint256 minimumUsd = 50 * 10**18;
        require(
            getConversionRate(msg.value) >= minimumUsd,
            "You need to spend more eth"
        );
        addressToAmountFunded[msg.sender] += msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You need to be the owner");
        _;
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function getConversionRate(uint256 ethAmount)
        public
        view
        returns (uint256)
    {
        uint256 ethPrice = getLatestPrice();
        uint256 ethAmountInUsd = (ethAmount * ethPrice) / 10**18;
        return ethAmountInUsd;
    }
}
