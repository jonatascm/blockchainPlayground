import { ERC20Token, ERC20Token__factory } from "../typechain";

import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("ERC20Token", function () {
  let ERC20Token: ERC20Token__factory;
  let erc20Token: ERC20Token;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  this.beforeEach(async () => {
    ERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20Token = await ERC20Token.deploy(1000);
    [owner, addr1] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Shout set the right owner", async () => {
      expect(await erc20Token.admin()).to.equal(owner.address);
    });
    it("Shout assing the total supply of tokens to the owner", async () => {
      const ownerBalance = await erc20Token.balanceOf(owner.address);
      expect(await erc20Token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Mint", () => {
    it("Should mint tokens to address", async () => {
      await erc20Token.mint(addr1.address, 50);
      const addr1Balance = await erc20Token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);
    });

    it("Should fail if minter isn't the admin ", async () => {
      await expect(
        erc20Token.connect(addr1).mint(owner.address, 50)
      ).to.be.revertedWith("Only admin");
    });
  });

  describe("Burn", () => {
    it("Should burn tokens from address", async () => {
      await erc20Token.mint(addr1.address, 50);
      let addr1Balance = await erc20Token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await erc20Token.connect(addr1).burn(50);
      addr1Balance = await erc20Token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
    });

    it("Should fail if burner doesn't have token ", async () => {
      await expect(erc20Token.connect(addr1).burn(5000)).to.be.revertedWith(
        "ERC20: burn amount exceeds balance"
      );
    });
  });
});
