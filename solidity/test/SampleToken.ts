import { SampleToken, SampleToken__factory } from "../typechain";

import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("SampleToken", function () {
  let SampleToken: SampleToken__factory;
  let sampleToken: SampleToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  this.beforeEach(async () => {
    SampleToken = await ethers.getContractFactory("SampleToken");
    sampleToken = await SampleToken.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Shout set the right owner", async () => {
      expect(await sampleToken.owner()).to.equal(owner.address);
    });
    it("Shout assing the total supply of tokens to the owner", async () => {
      const ownerBalance = await sampleToken.balanceOf(owner.address);
      expect(await sampleToken.totalSupply()).to.equal(ownerBalance);
    });
  });
  describe("Transactions", () => {
    it("Should transfer token between accounts", async () => {
      await sampleToken.transfer(addr1.address, 50);
      const addr1Balance = await sampleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await sampleToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await sampleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should update balances after transfer ", async () => {
      const initialOwnerBalance = await sampleToken.balanceOf(owner.address);
      await sampleToken.transfer(addr1.address, 200);
      await sampleToken.transfer(addr2.address, 80);
      const finalOwnerBalance = await sampleToken.balanceOf(owner.address);
      expect(finalOwnerBalance.toNumber()).to.equal(
        initialOwnerBalance.toNumber() - 280
      );

      const addr1Balance = await sampleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(200);
      const addr2Balance = await sampleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(80);
    });

    it("Should fail if sender doesnt have enough tokens", async () => {
      const initialOwnerBalance = await sampleToken.balanceOf(owner.address);
      await expect(
        sampleToken.connect(addr1).transfer(owner.address, 55)
      ).to.be.revertedWith("Not enough tokens");
      expect(await sampleToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should fail if amount == 0", async () => {
      await expect(
        sampleToken.connect(addr1).transfer(owner.address, 0)
      ).to.be.revertedWith("Invalid amount");
    });
  });
});
