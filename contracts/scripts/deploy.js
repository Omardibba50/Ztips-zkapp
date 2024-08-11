const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ZTipsToken
  const ZTipsToken = await hre.ethers.getContractFactory("ZTipsToken");
  const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1 million tokens
  const zTipsToken = await ZTipsToken.deploy(initialSupply);
  await zTipsToken.deployed();
  console.log("ZTipsToken deployed to:", zTipsToken.address);

  // Deploy ZTips
  const ZTips = await hre.ethers.getContractFactory("ZTips");
  const zTips = await ZTips.deploy(zTipsToken.address);
  await zTips.deployed();
  console.log("ZTips deployed to:", zTips.address);

  // Save the contract addresses to a file
  const fs = require("fs");
  const contracts = {
    ZTipsToken: zTipsToken.address,
    ZTips: zTips.address,
  };
  fs.writeFileSync("contracts.json", JSON.stringify(contracts, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });