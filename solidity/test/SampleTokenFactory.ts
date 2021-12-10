import { SampleTokenFactory, SampleTokenFactory__factory } from "../typechain";

import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("SampleTokenFactory", function () {
  let SampleTokenFactory: SampleTokenFactory__factory;
  let sampleTokenFactory: SampleTokenFactory;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  this.beforeEach(async () => {
    SampleTokenFactory = await ethers.getContractFactory("SampleTokenFactory");
    sampleTokenFactory = await SampleTokenFactory.deploy();
    [addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Shout deploy 2 tokens", async () => {
      await sampleTokenFactory.createSampleTokenContract();
      await sampleTokenFactory.createSampleTokenContract();
      const length = await sampleTokenFactory.totalTokens();
      expect(length).to.equal(2);
    });
  });
  describe("Transactions", () => {
    it("Should transfer token to accounts", async () => {
      await sampleTokenFactory.createSampleTokenContract();
      await sampleTokenFactory.factoryTransfer(0, 50, addr1.address);
      const addr1Balance = await sampleTokenFactory.factoryBalanceOf(
        0,
        addr1.address
      );
      expect(addr1Balance).to.equal(50);
    });

    it("Should update balances after transfer ", async () => {
      await sampleTokenFactory.createSampleTokenContract();
      const initialOwnerBalance = await sampleTokenFactory.factoryBalanceOf(
        0,
        "0x0000000000000000000000000000000000000000"
      );
      await sampleTokenFactory.factoryTransfer(0, 150, addr1.address);
      await sampleTokenFactory.factoryTransfer(0, 20, addr2.address);
      const finalOwnerBalance = await sampleTokenFactory.factoryBalanceOf(
        0,
        "0x0000000000000000000000000000000000000000"
      );
      expect(finalOwnerBalance.toNumber()).to.equal(
        initialOwnerBalance.toNumber() - 170
      );

      const addr1Balance = await sampleTokenFactory.factoryBalanceOf(
        0,
        addr1.address
      );
      expect(addr1Balance).to.equal(150);
      const addr2Balance = await sampleTokenFactory.factoryBalanceOf(
        0,
        addr2.address
      );
      expect(addr2Balance).to.equal(20);
    });
  });
});
