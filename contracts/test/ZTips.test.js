const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZTips", function () {
  let ZTips, zTips, ZTipsToken, zTipsToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    ZTipsToken = await ethers.getContractFactory("ZTipsToken");
    zTipsToken = await ZTipsToken.deploy(ethers.utils.parseEther("1000000"));
    await zTipsToken.deployed();

    ZTips = await ethers.getContractFactory("ZTips");
    zTips = await ZTips.deploy(zTipsToken.address);
    await zTips.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right token", async function () {
      expect(await zTips.bountyToken()).to.equal(zTipsToken.address);
    });
  });

  describe("Creating a bounty", function () {
    it("Should create a bounty with valid proof", async function () {
      const amount = ethers.utils.parseEther("100");
      await zTipsToken.approve(zTips.address, amount);

      // In a real scenario, you would generate a valid proof here
      const proof = ethers.utils.randomBytes(32);

      await expect(zTips.createBounty(amount, "Test Bounty", "Test Description", proof))
        .to.emit(zTips, "BountyCreated")
        .withArgs(0, owner.address, amount, "Test Bounty");
    });
  });

  // Add more tests for submitting tips, releasing bounties, etc.
});